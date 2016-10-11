export default function buildColladaLoader(THREE) { 
	THREE.ColladaLoader = function ( manager ) {
		this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
	};

	THREE.ColladaLoader.prototype = {
		constructor: THREE.ColladaLoader,

		load: function ( url, onLoad, onProgress, onError ) {
			function getBaseUrl( url ) {
				const parts = url.split( '/' );
				parts.pop();
				return ( parts.length < 1 ? '.' : parts.join( '/' ) ) + '/';
			}

			const scope = this;

			const loader = new THREE.XHRLoader( scope.manager );
			loader.load( url, function ( text ) {
				onLoad( scope.parse( text, getBaseUrl( url ) ) );
			}, onProgress, onError );
		},

		options: {
			set convertUpAxis ( value ) {
				// console.log( 'ColladaLoder.options.convertUpAxis: TODO' );
			}

		},

		setCrossOrigin: function ( value ) {
			this.crossOrigin = value;
		},

		parse: function ( text, baseUrl ) {
			function getElementsByTagName( xml, name ) {
				// Non recursive xml.getElementsByTagName() ...

				const array = [];
				const childNodes = xml.childNodes;

				for ( let i = 0, l = childNodes.length; i < l; i ++ ) {
					const child = childNodes[ i ];

					if ( child.nodeName === name ) {
						array.push( child );
					}
				}

				return array;
			}

			function parseFloats( text ) {
				if ( text.length === 0 ) return [];

				const parts = text.trim().split( /\s+/ );
				const array = new Array( parts.length );

				for ( let i = 0, l = parts.length; i < l; i ++ ) {
					array[ i ] = parseFloat( parts[ i ] );
				}

				return array;
			}

			function parseInts( text ) {
				if ( text.length === 0 ) return [];

				const parts = text.trim().split( /\s+/ );
				const array = new Array( parts.length );

				for ( let i = 0, l = parts.length; i < l; i ++ ) {
					array[ i ] = parseInt( parts[ i ] );
				}

				return array;
			}

			function parseId( text ) {
				return text.substring( 1 );
			}

			// asset

			function parseAsset( xml ) {
				return {
					unit: parseAssetUnit( getElementsByTagName( xml, 'unit' )[ 0 ] ),
					upAxis: parseAssetUpAxis( getElementsByTagName( xml, 'up_axis' )[ 0 ] )
				};
			}

			function parseAssetUnit( xml ) {
				return xml !== undefined ? parseFloat( xml.getAttribute( 'meter' ) ) : 1;
			}

			function parseAssetUpAxis( xml ) {
				return xml !== undefined ? xml.textContent : 'Y_UP';
			}

			// library

			function parseLibrary( xml, libraryName, nodeName, parser ) {
				const library = getElementsByTagName( xml, libraryName )[ 0 ];

				if ( library !== undefined ) {
					const elements = getElementsByTagName( library, nodeName );

					for ( let i = 0; i < elements.length; i ++ ) {
						parser( elements[ i ] );
					}
				}
			}

			function buildLibrary( data, builder ) {
				for ( const name in data ) {
					const object = data[ name ];
					object.build = builder( data[ name ] );
				}
			}

			// get

			function getBuild( data, builder ) {
				if ( data.build !== undefined ) return data.build;

				data.build = builder( data );

				return data.build;
			}

			// image

			const imageLoader = new THREE.ImageLoader();
			imageLoader.setCrossOrigin( this.crossOrigin );

			function parseImage( xml ) {
				const data = {
					init_from: getElementsByTagName( xml, 'init_from' )[ 0 ].textContent
				};

				library.images[ xml.getAttribute( 'id' ) ] = data;
			}

			function buildImage( data ) {
				if ( data.build !== undefined ) return data.build;

				let url = data.init_from;

				if ( baseUrl !== undefined ) url = baseUrl + url;

				return imageLoader.load( url );
			}

			function getImage( id ) {
				return getBuild( library.images[ id ], buildImage );
			}

			// effect

			function parseEffect( xml ) {
				const data = {};

				for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {
					const child = xml.childNodes[ i ];

					if ( child.nodeType !== 1 ) continue;

					switch ( child.nodeName ) {
					case 'profile_COMMON':
						data.profile = parseEffectProfileCOMMON( child );
						break;
					}
				}

				library.effects[ xml.getAttribute( 'id' ) ] = data;
			}

			function parseEffectProfileCOMMON( xml ) {
				const data = {
					surfaces: {},
					samplers: {}
				};

				for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {
					const child = xml.childNodes[ i ];

					if ( child.nodeType !== 1 ) continue;

					switch ( child.nodeName ) {
					case 'newparam':
						parseEffectNewparam( child, data );
						break;

					case 'technique':
						data.technique = parseEffectTechnique( child );
						break;
					}
				}

				return data;
			}

			function parseEffectNewparam( xml, data ) {
				const sid = xml.getAttribute( 'sid' );

				for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {
					const child = xml.childNodes[ i ];

					if ( child.nodeType !== 1 ) continue;

					switch ( child.nodeName ) {
					case 'surface':
						data.surfaces[ sid ] = parseEffectSurface( child );
						break;

					case 'sampler2D':
						data.samplers[ sid ] = parseEffectSampler( child );
						break;
					}
				}
			}

			function parseEffectSurface( xml ) {
				const data = {};

				for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {
					const child = xml.childNodes[ i ];

					if ( child.nodeType !== 1 ) continue;

					switch ( child.nodeName ) {
					case 'init_from':
						data.init_from = child.textContent;
						break;
					}
				}

				return data;
			}

			function parseEffectSampler( xml ) {
				const data = {};

				for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {
					const child = xml.childNodes[ i ];

					if ( child.nodeType !== 1 ) continue;

					switch ( child.nodeName ) {
					case 'source':
						data.source = child.textContent;
						break;
					}
				}

				return data;
			}

			function parseEffectTechnique( xml ) {
				const data = {};

				for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {
					const child = xml.childNodes[ i ];

					if ( child.nodeType !== 1 ) continue;

					switch ( child.nodeName ) {
					case 'constant':
					case 'lambert':
					case 'blinn':
					case 'phong':
						data.type = child.nodeName;
						data.parameters = parseEffectParameters( child );
						break;
					}
				}

				return data;
			}

			function parseEffectParameters( xml ) {
				const data = {};

				for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {
					const child = xml.childNodes[ i ];

					if ( child.nodeType !== 1 ) continue;

					switch ( child.nodeName ) {
					case 'emission':
					case 'diffuse':
					case 'specular':
					case 'shininess':
					case 'transparency':
						data[ child.nodeName ] = parseEffectParameter( child );
						break;
					}
				}

				return data;
			}

			function parseEffectParameter( xml ) {
				const data = {};

				for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {
					const child = xml.childNodes[ i ];

					if ( child.nodeType !== 1 ) continue;

					switch ( child.nodeName ) {
					case 'color':
						data[ child.nodeName ] = parseFloats( child.textContent );
						break;

					case 'float':
						data[ child.nodeName ] = parseFloat( child.textContent );
						break;

					case 'texture':
						data[ child.nodeName ] = { id: child.getAttribute( 'texture' ), extra: parseEffectParameterTexture( child ) };
						break;
					}
				}

				return data;
			}

			function parseEffectParameterTexture( xml ) {
				let data = {};

				for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {
					const child = xml.childNodes[ i ];

					if ( child.nodeType !== 1 ) continue;

					switch ( child.nodeName ) {
					case 'extra':
						data = parseEffectParameterTextureExtra( child );
						break;
					}
				}

				return data;
			}

			function parseEffectParameterTextureExtra( xml ) {
				const data = {};

				for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {
					const child = xml.childNodes[ i ];

					if ( child.nodeType !== 1 ) continue;

					switch ( child.nodeName ) {
					case 'technique':
						data[ child.nodeName ] = parseEffectParameterTextureExtraTechnique( child );
						break;
					}
				}

				return data;
			}

			function parseEffectParameterTextureExtraTechnique( xml ) {
				const data = {};

				for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {
					const child = xml.childNodes[ i ];

					if ( child.nodeType !== 1 ) continue;

					switch ( child.nodeName ) {
					case 'repeatU':
					case 'repeatV':
					case 'offsetU':
					case 'offsetV':
						data[ child.nodeName ] = parseFloat( child.textContent );
						break;

					case 'wrapU':
					case 'wrapV':
						data[ child.nodeName ] = parseInt( child.textContent );
						break;
					}
				}
				return data;
			}

			function buildEffect( data ) {
				return data;
			}

			function getEffect( id ) {
				return getBuild( library.effects[ id ], buildEffect );
			}

			// material

			function parseMaterial( xml ) {
				const data = {
					name: xml.getAttribute( 'name' )
				};

				for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {
					const child = xml.childNodes[ i ];

					if ( child.nodeType !== 1 ) continue;

					switch ( child.nodeName ) {
					case 'instance_effect':
						data.url = parseId( child.getAttribute( 'url' ) );
						break;
					}
				}

				library.materials[ xml.getAttribute( 'id' ) ] = data;
			}

			function buildMaterial( data ) {
				const effect = getEffect( data.url );
				const technique = effect.profile.technique;

				let material;

				switch ( technique.type ) {
				case 'phong':
				case 'blinn':
					material = new THREE.MeshPhongMaterial();
					break;

				case 'lambert':
					material = new THREE.MeshLambertMaterial();
					break;

				default:
					material = new THREE.MeshBasicMaterial();
					break;
				}

				material.name = data.name;

				function getTexture( textureObject ) {
					const sampler = effect.profile.samplers[ textureObject.id ];

					if ( sampler !== undefined ) {
						const surface = effect.profile.surfaces[ sampler.source ];

						const texture = new THREE.Texture( getImage( surface.init_from ) );

						const extra = textureObject.extra;

						if ( extra !== undefined && extra.technique !== undefined ) {
							const technique = extra.technique;

							texture.wrapS = technique.wrapU ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
							texture.wrapT = technique.wrapV ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;

							texture.offset.set( technique.offsetU, technique.offsetV );
							texture.repeat.set( technique.repeatU, technique.repeatV );
						} else {
							texture.wrapS = THREE.RepeatWrapping;
							texture.wrapT = THREE.RepeatWrapping;
						}

						texture.needsUpdate = true;

						return texture;
					}

					// console.error( 'ColladaLoder: Undefined sampler', textureObject.id );

					return null;
				}

				const parameters = technique.parameters;

				for ( const key in parameters ) {
					const parameter = parameters[ key ];

					switch ( key ) {
					case 'diffuse':
						if ( parameter.color ) material.color.fromArray( parameter.color );
						if ( parameter.texture ) material.map = getTexture( parameter.texture );
						break;
					case 'specular':
						if ( parameter.color && material.specular )
							material.specular.fromArray( parameter.color );
						break;
					case 'shininess':
						if ( parameter.float && material.shininess )
							material.shininess = parameter.float;
						break;
					case 'emission':
						if ( parameter.color && material.emissive )
							material.emissive.fromArray( parameter.color );
						break;
					case 'transparency':
						if ( parameter.float )
							material.opacity = parameter.float;
						if ( parameter.float !== 1 )
							material.transparent = true;
						break;
					}
				}

				return material;
			}

			function getMaterial( id ) {
				return getBuild( library.materials[ id ], buildMaterial );
			}

			// camera

			function parseCamera( xml ) {
				const data = {
					name: xml.getAttribute( 'name' )
				};

				for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {
					const child = xml.childNodes[ i ];

					if ( child.nodeType !== 1 ) continue;

					switch ( child.nodeName ) {
					case 'optics':
						data.optics = parseCameraOptics( child );
						break;
					}
				}

				library.cameras[ xml.getAttribute( 'id' ) ] = data;
			}

			function parseCameraOptics( xml ) {
				for ( let i = 0; i < xml.childNodes.length; i ++ ) {
					const child = xml.childNodes[ i ];

					switch ( child.nodeName ) {
					case 'technique_common':
						return parseCameraTechnique( child );
					}
				}

				return {};
			}

			function parseCameraTechnique( xml ) {
				const data = {};

				for ( let i = 0; i < xml.childNodes.length; i ++ ) {
					const child = xml.childNodes[ i ];

					switch ( child.nodeName ) {
					case 'perspective':
					case 'orthographic':

						data.technique = child.nodeName;
						data.parameters = parseCameraParameters( child );

						break;
					}
				}

				return data;
			}

			function parseCameraParameters( xml ) {
				const data = {};

				for ( let i = 0; i < xml.childNodes.length; i ++ ) {
					const child = xml.childNodes[ i ];

					switch ( child.nodeName ) {
					case 'xfov':
					case 'yfov':
					case 'xmag':
					case 'ymag':
					case 'znear':
					case 'zfar':
					case 'aspect_ratio':
						data[ child.nodeName ] = parseFloat( child.textContent );
						break;
					}
				}

				return data;
			}

			function buildCamera( data ) {
				let camera;

				switch ( data.optics.technique ) {
				case 'perspective':
					camera = new THREE.PerspectiveCamera(
						data.optics.parameters.yfov,
						data.optics.parameters.aspect_ratio,
						data.optics.parameters.znear,
						data.optics.parameters.zfar
					);
					break;

				case 'orthographic':
					camera = new THREE.OrthographicCamera( /* TODO */ );
					break;

				default:
					camera = new THREE.PerspectiveCamera();
					break;
				}

				camera.name = data.name;

				return camera;
			}

			function getCamera( id ) {
				return getBuild( library.cameras[ id ], buildCamera );
			}

			// light

			function parseLight( xml ) {
				let data = {};

				for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {
					const child = xml.childNodes[ i ];

					if ( child.nodeType !== 1 ) continue;

					switch ( child.nodeName ) {
					case 'technique_common':
						data = parseLightTechnique( child );
						break;
					}
				}

				library.lights[ xml.getAttribute( 'id' ) ] = data;
			}

			function parseLightTechnique( xml ) {
				const data = {};

				for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {
					const child = xml.childNodes[ i ];

					if ( child.nodeType !== 1 ) continue;

					switch ( child.nodeName ) {
					case 'directional':
					case 'point':
					case 'spot':
					case 'ambient':

						data.technique = child.nodeName;
						data.parameters = parseLightParameters( child );
					}
				}

				return data;
			}

			function parseLightParameters( xml ) {
				const data = {};

				for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {
					const child = xml.childNodes[ i ];

					if ( child.nodeType !== 1 ) continue;

					switch ( child.nodeName ) {
					case 'color': {
						const array = parseFloats( child.textContent );
						data.color = new THREE.Color().fromArray( array );
						break;
					}

					case 'falloff_angle': {
						data.falloffAngle = parseFloat( child.textContent );
						break;
					}

					case 'quadratic_attenuation': {
						const f = parseFloat( child.textContent );
						data.distance = f ? Math.sqrt( 1 / f ) : 0;
						break;
					}}
				}

				return data;
			}

			function buildLight( data ) {
				let light;

				switch ( data.technique ) {
				case 'directional': {
					light = new THREE.DirectionalLight();
					break;
				}

				case 'point': {
					light = new THREE.PointLight();
					break;
				}

				case 'spot': {
					light = new THREE.SpotLight();
					break;
				}

				case 'ambient': {
					light = new THREE.AmbientLight();
					break;
				}}

				if ( data.parameters.color ) light.color.copy( data.parameters.color );
				if ( data.parameters.distance ) light.distance = data.parameters.distance;

				return light;
			}

			function getLight( id ) {
				return getBuild( library.lights[ id ], buildLight );
			}

			// geometry

			function parseGeometry( xml ) {
				const data = {
					name: xml.getAttribute( 'name' ),
					sources: {},
					vertices: {},
					primitives: []
				};

				const mesh = getElementsByTagName( xml, 'mesh' )[ 0 ];

				for ( let i = 0; i < mesh.childNodes.length; i ++ ) {
					const child = mesh.childNodes[ i ];

					if ( child.nodeType !== 1 ) continue;

					const id = child.getAttribute( 'id' );

					switch ( child.nodeName ) {
					case 'source':
						data.sources[ id ] = parseGeometrySource( child );
						break;

					case 'vertices':
						// data.sources[ id ] = data.sources[ parseId( getElementsByTagName( child, 'input' )[ 0 ].getAttribute( 'source' ) ) ];
						data.vertices = parseGeometryVertices( child );
						break;

					case 'polygons':
						// console.log( 'ColladaLoader: Unsupported primitive type: ', child.nodeName );
						break;

					case 'lines':
					case 'linestrips':
					case 'polylist':
					case 'triangles':
						data.primitives.push( parseGeometryPrimitive( child ) );
						break;

					default:
						// console.log( child );
					}
				}

				library.geometries[ xml.getAttribute( 'id' ) ] = data;
			}

			function parseGeometrySource( xml ) {
				const data = {
					array: [],
					stride: 3
				};

				for ( let i = 0; i < xml.childNodes.length; i ++ ) {
					const child = xml.childNodes[ i ];

					if ( child.nodeType !== 1 ) continue;

					switch ( child.nodeName ) {
					case 'float_array': {
						data.array = parseFloats( child.textContent );
						break;
					}

					case 'technique_common': {
						const accessor = getElementsByTagName( child, 'accessor' )[ 0 ];

						if ( accessor !== undefined ) {
							data.stride = parseInt( accessor.getAttribute( 'stride' ) );
						}
						break;
					}

					default:
						// console.log( child );
					}
				}

				return data;
			}

			function parseGeometryVertices( xml ) {
				const data = {};

				for ( let i = 0; i < xml.childNodes.length; i ++ ) {
					const child = xml.childNodes[ i ];

					if ( child.nodeType !== 1 ) continue;

					data[ child.getAttribute( 'semantic' ) ] = parseId( child.getAttribute( 'source' ) );
				}

				return data;
			}

			function parseGeometryPrimitive( xml ) {
				const primitive = {
					type: xml.nodeName,
					material: xml.getAttribute( 'material' ),
					inputs: {},
					stride: 0
				};

				for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {
					const child = xml.childNodes[ i ];

					if ( child.nodeType !== 1 ) continue;

					switch ( child.nodeName ) {
					case 'input': {
						const id = parseId( child.getAttribute( 'source' ) );
						const semantic = child.getAttribute( 'semantic' );
						const offset = parseInt( child.getAttribute( 'offset' ) );
						primitive.inputs[ semantic ] = { id: id, offset: offset };
						primitive.stride = Math.max( primitive.stride, offset + 1 );
						break;
					}

					case 'vcount': {
						primitive.vcount = parseInts( child.textContent );
						break;
					}

					case 'p': {
						primitive.p = parseInts( child.textContent );
						break;
					}}
				}

				return primitive;
			}

			const DEFAULT_LINEMATERIAL = new THREE.LineBasicMaterial();
			const DEFAULT_MESHMATERIAL = new THREE.MeshPhongMaterial();

			function buildGeometry( data ) {
				const group = {};

				const sources = data.sources;
				const vertices = data.vertices;
				const primitives = data.primitives;

				if ( primitives.length === 0 ) return group;

				for ( let p = 0; p < primitives.length; p ++ ) {
					const primitive = primitives[ p ];
					const inputs = primitive.inputs;

					const geometry = new THREE.BufferGeometry();

					if ( data.name ) geometry.name = data.name;

					for ( const name in inputs ) {
						const input = inputs[ name ];

						switch ( name )	{
						case 'VERTEX':
							for ( const key in vertices ) {
								geometry.addAttribute( key.toLowerCase(), buildGeometryAttribute( primitive, sources[ vertices[ key ] ], input.offset ) );
							}
							break;

						case 'NORMAL':
							geometry.addAttribute( 'normal', buildGeometryAttribute( primitive, sources[ input.id ], input.offset ) );
							break;

						case 'COLOR':
							geometry.addAttribute( 'color', buildGeometryAttribute( primitive, sources[ input.id ], input.offset ) );
							break;

						case 'TEXCOORD':
							geometry.addAttribute( 'uv', buildGeometryAttribute( primitive, sources[ input.id ], input.offset ) );
							break;
						}
					}

					let object;

					switch ( primitive.type ) {
					case 'lines':
						object = new THREE.LineSegments( geometry, DEFAULT_LINEMATERIAL );
						break;

					case 'linestrips':
						object = new THREE.Line( geometry, DEFAULT_LINEMATERIAL );
						break;

					case 'triangles':
					case 'polylist':
						object = new THREE.Mesh( geometry, DEFAULT_MESHMATERIAL );
						break;
					}

					group[ primitive.material ] = object;
				}

				return group;
			}

			function buildGeometryAttribute( primitive, source, offset ) {
				const indices = primitive.p;
				const stride = primitive.stride;
				const vcount = primitive.vcount;

				function pushVector( i ) {
					let index = indices[ i + offset ] * sourceStride;
					const length = index + sourceStride;

					for ( ; index < length; index ++ ) {
						array.push( sourceArray[ index ] );
					}
				}

				let maxcount = 0;

				const sourceArray = source.array;
				const sourceStride = source.stride;

				const array = [];

				if ( primitive.vcount !== undefined ) {
					let index = 0;

					for ( let i = 0, l = vcount.length; i < l; i ++ ) {
						const count = vcount[ i ];

						if ( count === 4 ) {
							const a = index + stride * 0;
							const b = index + stride * 1;
							const c = index + stride * 2;
							const d = index + stride * 3;

							pushVector( a ); pushVector( b ); pushVector( d );
							pushVector( b ); pushVector( c ); pushVector( d );
						} else if ( count === 3 ) {
							const a = index + stride * 0;
							const b = index + stride * 1;
							const c = index + stride * 2;

							pushVector( a ); pushVector( b ); pushVector( c );
						} else {
							maxcount = Math.max( maxcount, count );
						}

						index += stride * count;
					}

					if ( maxcount > 0 ) {
						// console.log( 'ColladaLoader: Geometry has faces with more than 4 vertices.' );
					}
				} else {
					for ( let i = 0, l = indices.length; i < l; i += stride ) {
						pushVector( i );
					}
				}

				return new THREE.Float32Attribute( array, sourceStride );
			}

			function getGeometry( id ) {
				return getBuild( library.geometries[ id ], buildGeometry );
			}

			// nodes

			const matrix = new THREE.Matrix4();
			const vector = new THREE.Vector3();

			function parseNode( xml ) {
				const data = {
					name: xml.getAttribute( 'name' ),
					matrix: new THREE.Matrix4(),
					nodes: [],
					instanceCameras: [],
					instanceLights: [],
					instanceGeometries: [],
					instanceNodes: []
				};

				for ( let i = 0; i < xml.childNodes.length; i ++ ) {
					const child = xml.childNodes[ i ];

					if ( child.nodeType !== 1 ) continue;

					const array = parseFloats( child.textContent );

					switch ( child.nodeName ) {
					case 'node':
						parseNode( child );
						data.nodes.push( child.getAttribute( 'id' ) );
						break;

					case 'instance_camera':
						data.instanceCameras.push( parseId( child.getAttribute( 'url' ) ) );
						break;

					case 'instance_light':
						data.instanceLights.push( parseId( child.getAttribute( 'url' ) ) );
						break;

					case 'instance_geometry':
						data.instanceGeometries.push( parseNodeInstanceGeometry( child ) );
						break;

					case 'instance_node':
						data.instanceNodes.push( parseId( child.getAttribute( 'url' ) ) );
						break;

					case 'matrix':
						data.matrix.multiply( matrix.fromArray( array ).transpose() ); // .transpose() when Z_UP?
						break;

					case 'translate':
						vector.fromArray( array );
						data.matrix.multiply( matrix.makeTranslation( vector.x, vector.y, vector.z ) );
						break;

					case 'rotate': {
						const angle = THREE.Math.degToRad( array[ 3 ] );
						data.matrix.multiply( matrix.makeRotationAxis( vector.fromArray( array ), angle ) );
						break;
					}
					case 'scale':
						data.matrix.scale( vector.fromArray( array ) );
						break;

					case 'extra':
						break;

					default:
						// console.log( child );
					}
				}

				if ( xml.getAttribute( 'id' ) !== null ) {
					library.nodes[ xml.getAttribute( 'id' ) ] = data;
				}

				return data;
			}

			function parseNodeInstanceGeometry( xml ) {
				const data = {
					id: parseId( xml.getAttribute( 'url' ) ),
					materials: {}
				};

				for ( let i = 0; i < xml.childNodes.length; i ++ ) {
					const child = xml.childNodes[ i ];

					if ( child.nodeName === 'bind_material' ) {
						const instances = child.getElementsByTagName( 'instance_material' );

						for ( let j = 0; j < instances.length; j ++ ) {
							const instance = instances[ j ];
							const symbol = instance.getAttribute( 'symbol' );
							const target = instance.getAttribute( 'target' );

							data.materials[ symbol ] = parseId( target );
						}

						break;
					}
				}

				return data;
			}

			function buildNode( data ) {
				const objects = [];

				const matrix = data.matrix;
				const nodes = data.nodes;
				const instanceCameras = data.instanceCameras;
				const instanceLights = data.instanceLights;
				const instanceGeometries = data.instanceGeometries;
				const instanceNodes = data.instanceNodes;

				for ( let i = 0, l = nodes.length; i < l; i ++ ) {
					objects.push( getNode( nodes[ i ] ).clone() );
				}

				for ( let i = 0, l = instanceCameras.length; i < l; i ++ ) {
					objects.push( getCamera( instanceCameras[ i ] ).clone() );
				}

				for ( let i = 0, l = instanceLights.length; i < l; i ++ ) {
					objects.push( getLight( instanceLights[ i ] ).clone() );
				}

				for ( let i = 0, l = instanceGeometries.length; i < l; i ++ ) {
					const instance = instanceGeometries[ i ];
					const geometries = getGeometry( instance.id );

					for ( const key in geometries ) {
						const object = geometries[ key ].clone();

						if ( instance.materials[ key ] !== undefined ) {
							object.material = getMaterial( instance.materials[ key ] );
						}

						objects.push( object );
					}
				}

				for ( let i = 0, l = instanceNodes.length; i < l; i ++ ) {
					objects.push( getNode( instanceNodes[ i ] ).clone() );
				}

				let object;

				if ( nodes.length === 0 && objects.length === 1 ) {
					object = objects[ 0 ];
				} else {
					object = new THREE.Group();

					for ( let i = 0; i < objects.length; i ++ ) {
						object.add( objects[ i ] );
					}
				}

				object.name = data.name;
				matrix.decompose( object.position, object.quaternion, object.scale );

				return object;
			}

			function getNode( id ) {
				return getBuild( library.nodes[ id ], buildNode );
			}

			// visual scenes

			function parseVisualScene( xml ) {
				const data = {
					name: xml.getAttribute( 'name' ),
					children: []
				};

				const elements = getElementsByTagName( xml, 'node' );

				for ( let i = 0; i < elements.length; i ++ ) {
					data.children.push( parseNode( elements[ i ] ) );
				}

				library.visualScenes[ xml.getAttribute( 'id' ) ] = data;
			}

			function buildVisualScene( data ) {
				const group = new THREE.Group();
				group.name = data.name;

				const children = data.children;

				for ( let i = 0; i < children.length; i ++ ) {
					group.add( buildNode( children[ i ] ) );
				}

				return group;
			}

			function getVisualScene( id ) {
				return getBuild( library.visualScenes[ id ], buildVisualScene );
			}

			// scenes

			function parseScene( xml ) {
				const instance = getElementsByTagName( xml, 'instance_visual_scene' )[ 0 ];
				return getVisualScene( parseId( instance.getAttribute( 'url' ) ) );
			}

			// console.time( 'ColladaLoader' );

			if ( text.length === 0 ) {
				return { scene: new THREE.Scene() };
			}

			// console.time( 'ColladaLoader: DOMParser' );

			const xml = new DOMParser().parseFromString( text, 'application/xml' );

			// console.timeEnd( 'ColladaLoader: DOMParser' );

			const collada = getElementsByTagName( xml, 'COLLADA' )[ 0 ];

			// metadata

			// const version = collada.getAttribute( 'version' );
			// console.log( 'ColladaLoader: File version', version );

			const asset = parseAsset( getElementsByTagName( collada, 'asset' )[ 0 ] );

			//

			const library = {
				images: {},
				effects: {},
				materials: {},
				cameras: {},
				lights: {},
				geometries: {},
				nodes: {},
				visualScenes: {},
				kinematics : {
					joints: []
				}
			};

			// console.time( 'ColladaLoader: Parse' );

			parseLibrary( collada, 'library_images', 'image', parseImage );
			parseLibrary( collada, 'library_effects', 'effect', parseEffect );
			parseLibrary( collada, 'library_materials', 'material', parseMaterial );
			parseLibrary( collada, 'library_cameras', 'camera', parseCamera );
			parseLibrary( collada, 'library_lights', 'light', parseLight );
			parseLibrary( collada, 'library_geometries', 'geometry', parseGeometry );
			parseLibrary( collada, 'library_nodes', 'node', parseNode );
			parseLibrary( collada, 'library_visual_scenes', 'visual_scene', parseVisualScene );
			

			// kinematicsModels = parseLib( "library_kinematics_models kinematics_model", KinematicsModel, "kinematics_model" );



			// console.timeEnd( 'ColladaLoader: Parse' );

			// console.time( 'ColladaLoader: Build' );

			buildLibrary( library.images, buildImage );
			buildLibrary( library.effects, buildEffect );
			buildLibrary( library.materials, buildMaterial );
			buildLibrary( library.cameras, buildCamera );
			buildLibrary( library.lights, buildLight );
			buildLibrary( library.geometries, buildGeometry );
			buildLibrary( library.nodes, buildNode );
			buildLibrary( library.visualScenes, buildVisualScene );

			// buildLibrary( library.kinematics )

			// console.timeEnd( 'ColladaLoader: Build' );

			// // console.log( library );

			const scene = parseScene( getElementsByTagName( collada, 'scene' )[ 0 ] );

			if ( asset.upAxis === 'Z_UP' ) {
				scene.rotation.x = - Math.PI / 2;
			}

			scene.scale.multiplyScalar( asset.unit );

			// console.timeEnd( 'ColladaLoader' );

			// // console.log( scene );

			return {
				animations: [],
				kinematics: { joints: [] },
				scene: scene
			};
		}
	};
}