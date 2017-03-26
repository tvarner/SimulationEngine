import ROSLIB from 'roslib';

export function initRosBridge(robot) {
	// KE 2 : add this to robot object
	robot.ros = new ROSLIB.Ros({
		// url : 'ws://192.168.1.152:9090'
		// url : 'ws://fetch7:9090'
		// url : 'ws://fetch18.lan:9090'
		url : 'ws://192.168.1.118:9090'
	}); 

	robot.ros.on('connection', function() {
		console.info('robot: roslib: connect to websocket server.');
	});

	robot.ros.on('error', function(error) {
		console.info('robot: roslib: error robot.connecting to websocket server', error);
	});

	robot.ros.on('close', function() {
		console.info('robot: roslib: connection to websocket server closed.');
	});

	// KE : add this to robot object
	robot.listener = new ROSLIB.Topic({
		ros : robot.ros,
		name : '/joint_states_throttle',
		// name : '/joint_states',
		messageType : 'sensor_msgs/JointState'
	}); 
		// run topic throttling on ros backend
		// rosrun topic_tools throttle messages joint_states 2
		// name : '/joint_states',

	robot.listener.subscribe(function(message) {
		robot.textbar.innerHTML = 'joint angles: '+'<br>';
		for (let i=0;i<message.name.length;i++) {
			if (typeof robot.robot.joints[message.name[i]] !== 'undefined')
				robot.robot.joints[message.name[i]].angle = message.position[i];
				// console.info('robot: roslib: set '+message.name[i]+' to '+message.position[i]);
				robot.textbar.innerHTML += message.name[i]+' to '+message.position[i]+'<br>';
		}
		// console.log('robot: roslib: new message at '+message.header.stamp.secs+'.'+message.header.stamp.nsecs);
		robot.textbar.innerHTML += message.header.stamp.secs+'.'+message.header.stamp.nsecs;
	});

	robot.rosManip = new ROSLIB.Topic({
		ros : robot.ros,
		name : '/fetch_grasp',
		messageType : 'fetch_manipulation_pipeline/fetchGrasp'
	});

	// KE clean up topic formatting
	robot.rosManipGrasp = new ROSLIB.Message({
		"normal":[{"x":0.3, "y": 0.5, "z":0.6}],
		"principalAxis":[{"x": 0.6, "y": 0.7, "z": 0.8}],
		"point":[{"x": 0.9, "y": 1.0, "z": 1.1}],
		"objnum":[{"data":1}] 
	});

	//  "msg": { "normal":[{"x":0.3, "y": 0.5, "z":0.6}],"principalAxis":[{"x": 0.6, "y": 0.7, "z": 0.8}],"point":[{"x": 0.9, "y": 1.0, "z": 1.1}],"objnum":[{"data":1}]}

	robot.rosCmdVel = new ROSLIB.Topic({
		ros : robot.ros,
		name : '/cmd_vel',
		messageType : 'geometry_msgs/Twist'
	});

	robot.rosTwistFwd = new ROSLIB.Message({
		linear : {
			x : 1.0,
			y : 0.0,
			z : 0.0
		},
		angular : {
			x : 0.0,
			y : 0.0,
			z : 0.0
		}
	});

	robot.rosTwistBwd = new ROSLIB.Message({
		linear : {
			x : -1.0,
			y : 0.0,
			z : 0.0
		},
		angular : {
			x : 0.0,
			y : 0.0,
			z : 0.0
		}
	});

	robot.rosTwistRht = new ROSLIB.Message({
		linear : {
			x : 0.0,
			y : 0.0,
			z : 0.0
		},
		angular : {
			x : 0.0,
			y : 0.0,
			z : -1.0
		}
	});

	robot.rosTwistLft = new ROSLIB.Message({
		linear : {
			x : 0.0,
			y : 0.0,
			z : 0.0
		},
		angular : {
			x : 0.0,
			y : 0.0,
			z : 1.0
		}
	});
}