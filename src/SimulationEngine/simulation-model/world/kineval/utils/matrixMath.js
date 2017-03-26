import * as THREE from 'three';
import numeric from './numeric';

// ////////////////////////////////////////////////
// ///     MATH FUNCTIONS
// ////////////////////////////////////////////////

	// ////////////////////////////////////////////////
	// ///     MATRIX ALGEBRA AND GEOMETRIC TRANSFORMS 
	// ////////////////////////////////////////////////


	// STENCIL: reference matrix code has the following functions:
	//   matrix_pseudoinverse

export default { 
	matrix_pseudoinverse: function(mat) {

		// returns the pseudoinverse of the input matrix mat
		const num_cols = mat[0].length;
		const num_rows = mat.length;

		let transpose_mat;
		let regular_mat;
		
		if (num_rows === num_cols) {
			// 'mat' is a square matrix, pseudoinverse is identical to direct inverse
			return numeric.inv(mat);
		} else if(num_rows > num_cols) {
			// if we have more rows than columns
			transpose_mat = this.matrix_transpose(mat);
			regular_mat = this.matrix_multiply(transpose_mat, mat);
			return this.matrix_multiply(numeric.inv(regular_mat), transpose_mat);
		} else {
			// if we have more columns than rows
			transpose_mat = this.matrix_transpose(mat);
			regular_mat = this.matrix_multiply(mat, transpose_mat);
			return this.matrix_multiply(transpose_mat, numeric.inv(regular_mat));
		}
	},
		//   matrix_invert_affine
			// --> for collision detection

	matrix_copy: function(m1) {
		// returns 2D array that is a copy of m1

		const mat = [];
		let i,j;

		for ( i=0;i<m1.length;i++) { // for each row of m1
			mat[i] = [];
			for (j=0;j<m1[0].length;j++) { // for each column of m1
				mat[i][j] = m1[i][j];
			}
		}
		return mat;
	},

		//   matrix_multiply
	matrix_multiply: function(m1, m2) {
		// validate matrix
		for (let i = 0; i < m1.length; i++) {
			if (m1[i].length !== m2.length) {
				throw new Error('#columns in m1 != # rows in m2');
			}
		}

		const B_mat_length = m2[0].length;

		for (let i = 1; i < m2.length; i++) {
			if (m2[i].length !== B_mat_length) {
				throw new Error('invalid row dimensions in m2');
			}
		}

		const result_mat = [];

		// compute result_mat
		for (let i = 0; i < m1.length; i++) {
			result_mat.push([]);
			for (let j = 0; j < m2[0].length; j++) {
				let result = 0;
				// take dot product row i and column j
				for (let k = 0; k < m1[i].length; k++) {
					result += (m1[i][k] * m2[k][j]);
				}
				result_mat[i].push(result);
			}
		}
		return result_mat;
	},

	matrix_inverse: function(/* m1 */) { 
		// TODO
	},

	matrix_transpose: function(m1) {
		const result_mat = [];
		for (let i = 0; i < m1[0].length; i++) {
			result_mat.push([]);
			for (let j = 0; j < m1.length; j++) {
				result_mat[i].push(m1[j][i]);
			}
		}
		return result_mat;
	},

	vectorsEqual: function(v1, v2) { 
		for (let i = 0; i < v1.length; i++) {
			if (v1[i] !== v2[i]) {
				return false;
			}
		}
		return true;
	},

	vector_normalize: function(v1) {
		let sum = 0;
		const result_vec = [];
		for (let i = 0; i < v1.length; i++) { 
			sum += v1[i] * v1[i]; 
		}
		const magnitude = Math.sqrt(sum);

		// check whether v is a 0 vector, avoid zero-division error
		const EPS = 1e-10;
		if (magnitude < EPS) { return v1; }

		for (let i = 0; i < v1.length; i++) { 
			result_vec.push(v1[i] / magnitude);
		}

		return result_vec;
	},
		//   vector_cross
	vector_cross: function(v1, v2) { 
		const cross_product = [];
		cross_product[0] = v1[1] * v2[2] - v1[2] * v2[1];
		cross_product[1] = v1[2] * v2[0] - v1[0] * v2[2];
		cross_product[2] = v1[0] * v2[1] - v1[1] * v2[0];
		return cross_product;
	},

	vector_copy: function(v1) { 
		const v = [];
		for (let i=0;i<v1.length;i++) { // for each row of m1
			v[i] = v1[i];
		}

		return v;
	},

	// Returns v1 - v2;
	vector_subtract: function(v1, v2) { 
		const result_vec = [];

		if (v1.length !== v2.length) { 
			throw new Error('invalid vector sizes for subtraction');
		}

		for (let i = 0; i < v1.length; i++) {
			// column vector
			if (Array.isArray(v1[i]) && Array.isArray(v2[i])) {
				result_vec.push([v1[i][0] - v2[i][0]]);

			// row vector
			} else if (typeof v1[i] === 'number' && typeof v2[i] === 'number') { 
				result_vec.push(v1[i] - v2[i]);
			}
		}

		return result_vec;
	},

	vector_add: function(v1, v2) { 
		const result_vec = [];

		if (v1.length !== v2.length) { 
			throw new Error('invalid vector sizes for subtraction');
		}

		for (let i = 0; i < v1.length; i++) {
			// column vector
			if (Array.isArray(v1[i]) && Array.isArray(v2[i])) {
				result_vec.push([v1[i][0] + v2[i][0]]);

			// row vector
			} else if (typeof v1[i] === 'number' && typeof v2[i] === 'number') { 
				result_vec.push(v1[i] + v2[i]);
			}
		}

		return result_vec;
	},

	vector_scale: function(v1, s) {
		const result_vec = [];

		for (let i = 0; i < v1.length; i++) { 
			if (Array.isArray(v1[i])) { 
				result_vec[i] = v1[i][0] * s; 
			} else { 
				result_vec[i] = v1[i] * s; 
			}
		}

		return result_vec;
	},

	vector_magnitude: function(v1) { 
		let mag = 0;

		for (let i = 0; i < v1.length; i++) { 
			mag += v1[i] * v1[i];
		}

		return Math.sqrt(mag);
	},

		//   generate_identity
	generate_identity: function(m1) {
		// need to test
		const result_mat = [];
		for (let i = 0; i < m1.length; i++) {
			const row_vec = [];
			for (let j = 0; j < m1.length; j++) {
				row_vec.push(0);
			}
			row_vec[i] = 1;
			result_mat.push(row_vec);
		}
	},
		//   generate_translation_matrix
	generate_translation_matrix: function(dx, dy, dz) {
		return [
			[1, 0, 0, dx],
			[0, 1, 0, dy],
			[0, 0, 1, dz],
			[0, 0, 0, 1]
		];
	},
		//   generate_rotation_matrix_X
	generate_rotation_matrix_X: function(rx) {
		return [
			[1, 0, 0, 0],
			[0, Math.cos(rx), -Math.sin(rx), 0],
			[0, Math.sin(rx), Math.cos(rx), 0],
			[0, 0, 0, 1]
		];
	},
		//   generate_rotation_matrix_Y
	generate_rotation_matrix_Y: function(ry) {
		return [
			[Math.cos(ry), 0, Math.sin(ry), 0],
			[0, 1, 0, 0],
			[-Math.sin(ry), 0, Math.cos(ry), 0],
			[0, 0, 0, 1]
		];
	},
		//   generate_rotation_matrix_Z
	generate_rotation_matrix_Z: function(rz) {
		return [
			[Math.cos(rz), -Math.sin(rz), 0, 0],
			[Math.sin(rz), Math.cos(rz), 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1]
		];
	},

	getRandomInt: function(min, max) {
		const _min = Math.ceil(min);
		const _max = Math.floor(max);
		return Math.floor(Math.random() * (_max - _min)) + _min;
	},

	getRandomArbitrary: function(min, max) {
		return Math.random() * (max - min) + min;
	},

	vector_subtraction: function(v1, v2) {
		// vector_subtraction returns the difference
		// NOTE: v1, v2 have to be both column vectors or row vectors

		const is_v1_col = !(typeof v1[0][0] === 'undefined');
		const is_v2_col = !(typeof v2[0][0] === 'undefined');

		const n = v1.length;
		const v_diff = [];

		if (is_v1_col && is_v2_col) {
			// both v1 and v2 are column vectors
			for(let i=0; i<n; i++) {
				v_diff[i] = [];
				v_diff[i][0] = v1[i][0] - v2[i][0];
			}        
		}
		if (!is_v1_col && !is_v2_col) {
			// both v1 and v2 are row vectors
			for(let i=0; i<n; i++) {
				v_diff[i] = v1[i] - v2[i];
			}        
		}

		return v_diff;
	},

	angle_from_rotation_matrix: function(xform) {
		// xform is a 4x4 transform matrix, we want to retrieve the Euler angle from it
		// the rotation part of the matrix is
		/*
			[ 
			  cos(y)sin(z),                    -cos(y)sin(z),                     sin(y),        0
			  cos(x)sin(z)+sin(x)sin(y)cos(z),  cos(x)cos(z)-sin(x)sin(y)sin(z), -sin(x)cos(y),  0
			  sin(x)sin(z)-cos(x)sin(y)cos(z),  sin(x)cos(z)+cos(x)sin(y)sin(z),  cos(x)cos(y),  0
			  0,                                0,                                0,             1
			]
		*/

		// step1: obtain the rotation part of xform
		const xform11 = xform[0][0], xform12 = xform[0][1], xform13 = xform[0][2];
		const xform22 = xform[1][1], xform23 = xform[1][2];
		const xform32 = xform[2][1], xform33 = xform[2][2];

		// step2: compute the angle
		let angle_x, angle_z;
		const angle_y = Math.asin(Math.max(-1, Math.min(xform13, 1)));

		const EPS = 1e-5;

		if (Math.abs(xform13) < 1-EPS) {
			// abs(xform13) !== 1
			angle_x = Math.atan2(-xform23, xform33);
			angle_z = Math.atan2(-xform12, xform11);
		} else {
			// abs(xform13) === 1
			angle_x = Math.atan2(xform32, xform22);
			angle_z = 0;
		}

		return [angle_x, angle_y, angle_z];
	},

	//////////////////////////////////////////////////
	/////     QUATERNION TRANSFORM ROUTINES 
	//////////////////////////////////////////////////

		// STENCIL: reference quaternion code has the following functions:
		//   quaternion_from_axisangle
		//   quaternion_normalize
		//   quaternion_to_rotation_matrix
		//   quaternion_multiply


		// STENCIL: reference quaternion code has the following functions:
	quaternion_from_axisangle: function(axis, angle) {
		// quaternion_from_axisangle constructs quaternion based on given axis and angle
		// INPUT:
		//    axis:  3D array containing the coordinate of the axis
		//    angle: angle of rotation
		// OUTPUT:
		//    q: the quaternion corresponding to the input argument

		const sin_theta = Math.sin(angle/2);
		const cos_theta = Math.cos(angle/2);

		const q = [
				cos_theta, 
				axis[0]*sin_theta, 
				axis[1]*sin_theta, 
				axis[2]*sin_theta
			];

		return q;
	},

	quaternion_normalize: function(q) {
		// quaternion_normalize normalizes the given quaternion 

		return this.vector_normalize(q);
	},

	quaternion_to_rotation_matrix: function(q) {
		// quaternion_to_rotation_matrix performs the homogeneous conversion from quaternion to rotation matrix
		const q0 = q[0]; const q1 = q[1]; const q2 = q[2]; const q3 = q[3];

		// NOTE that the rotation matrix should be of homogeneous form (4 x 4)
		const mat = [
			[q0*q0 + q1*q1 - q2*q2 - q3*q3, 2*(q1*q2 - q0*q3), 2*(q0*q2 + q1*q3), 0],
			[2*(q1*q2 + q0*q3), q0*q0 - q1*q1 + q2*q2 - q3*q3, 2*(q2*q3 - q0*q1), 0],
			[2*(q1*q3 - q0*q2), 2*(q0*q1 + q2*q3), q0*q0 - q1*q1 - q2*q2 + q3*q3, 0],
			[0, 0, 0, 1]
		];

		return mat;   
	},

	quaternion_multiply: function(q1,q2) {
		// quaternion_multiply returns the product of two given quaternions

		const a = q1[0]; const b = q1[1]; const c = q1[2]; const d = q1[3];
		const e = q2[0]; const f = q2[1]; const g = q2[2]; const h = q2[3];

		const q = [
				a*e - b*f - c*g - d*h,
				a*f + b*e + c*h - d*g,
				a*g - b*h + c*e + d*f,
				a*h + b*g - c*f + d*e
		];

		return q;
	},

	//////////////////////////////////////////////////
	/////     THREEJS ROUTINE FUNCTIONS
	//////////////////////////////////////////////////

		//////////////////////////////////////////////////
		/////     threejs SUPPORT ROUTINES
		/////       data structure conversion
		/////       apply transforms to objects
		/////
		/////     ASSUME: threejs included in html
		//////////////////////////////////////////////////


	matrix_threejs_to_2Darray: function(tmat) {
	// conversion of threejs 4x4 matrix to 2D array

		const te = tmat.elements;
		//const amat = [[te[0],te[1],te[2],te[3]], [te[4],te[5],te[6],te[7]], [te[8],te[9],te[10],te[11]], [te[12],te[13],te[14],te[15]]];
		const amat = [
			[te[0],te[4],te[8],te[12]], 
			[te[1],te[5],te[9],te[13]], 
			[te[2],te[6],te[10],te[14]], 
			[te[3],te[7],te[11],te[15]]
		];

		return amat;

		/* threejs matrix format reference
			te[0] = n11; te[4] = n12; te[8] = n13; te[12] = n14;
			te[1] = n21; te[5] = n22; te[9] = n23; te[13] = n24;
			te[2] = n31; te[6] = n32; te[10] = n33; te[14] = n34;
			te[3] = n41; te[7] = n42; te[11] = n43; te[15] = n44;
		*/
	},


	matrix_2Darray_to_threejs: function(amat) {
	// conversion of 2D 4x4 matrix array to threejs format

		/* THREE r62
		let tmat = new THREE.Matrix4(
			amat[0][0], amat[0][1], amat[0][2], amat[0][3],
			amat[1][0], amat[1][1], amat[1][2], amat[1][3],
			amat[2][0], amat[2][1], amat[2][2], amat[2][3],
			amat[3][0], amat[3][1], amat[3][2], amat[3][3] 
		);
		*/

		const tmat = new THREE.Matrix4().set(
			amat[0][0], amat[0][1], amat[0][2], amat[0][3],
			amat[1][0], amat[1][1], amat[1][2], amat[1][3],
			amat[2][0], amat[2][1], amat[2][2], amat[2][3],
			amat[3][0], amat[3][1], amat[3][2], amat[3][3] 
		);

		return tmat;

		/* threejs matrix format reference
		te[0] = n11; te[4] = n12; te[8] = n13; te[12] = n14;
		te[1] = n21; te[5] = n22; te[9] = n23; te[13] = n24;
		te[2] = n31; te[6] = n32; te[10] = n33; te[14] = n34;
		te[3] = n41; te[7] = n42; te[11] = n43; te[15] = n44;
		*/
	},

	simpleApplyMatrix: function(obj,mat) {
		// set the transformation matrix of a threejs object from a matrix
		// like Object3D.applyMatrix() but without multiplying with the current object transform

		// a few "don'ts"
		//joint.geom.matrixAutoUpdate = false;  // don't make this false, does not render updated of geom xform
		//joint.geom.matrix = tempmat;
		//joint.geom.applyMatrix(tempmat); // don't use applyMatrix, it mat mults with current xform

		// update object scale
		obj.position.setFromMatrixPosition(mat); // newer renaming of getFromMatrixPosition (bb31515d6b)
		// THREE r62 obj.position.getPositionFromMatrix(mat);

		// update object scale
		obj.scale.setFromMatrixScale(mat); // newer renaming of getFromMatrixScale (bb31515d6b)
		// THREE r62 obj.scale.getScaleFromMatrix(mat);

		// update object rotation as quaternion
		const m1 = new THREE.Matrix4();
		m1.extractRotation(mat);
		obj.quaternion.setFromRotationMatrix( m1 );
	}
};