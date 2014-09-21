var beacons = {};

function appendTd(root, value, id) {
	var text = document.createTextNode(value);
	var td = document.createElement("td");
	if(id) {
		td.id = id;
	}
	td.appendChild(text);
	root.appendChild(td);
}

function hex16(i) {
	var s = i.toString(16);
	while(s.length < 4) {
		s = '0'+s;
	}
	return s;
}

function Recipe() {
	console.log("test");
	data = null;
	$.get(
    "http://www.homeease.me/toasteroven/broil",
    {paramOne : 1, paramX : 'abc'},
    function(data) {
       alert('done');
    }
	);
}

function KillM() {
	data = null;
	$.get(
		"http://www.homeease.me/microwave/stop",
		{paramOne : 1, paramX : 'abc'},
		function(data) {
			alert('done');
		}
	);
}

function KillO() {
	data = null;
	$.get(
		"http://www.homeease.me/toasteroven/off",
		{paramOne : 1, paramX : 'abc'},
		function(data) {
			alert('done');
		}
	);
}


function MRecipe() {
	console.log("test");
	data = null;
	$.get(
		"http://www.homeease.me/microwave/cook/zapDemo",
		{paramOne : 1, paramX : 'abc'},
		function(data) {
			alert('done');
		}
	);
}

var app = {
	initialize: function() {
		// Important to stop scanning when page reloads/closes!
		window.addEventListener('beforeunload', function(e)
		{
			//iBeacon.stopScan();
		});

		this.bindEvents();
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function() {
		//console.log('cordova: ' + JSON.stringify(cordova, null, "\t"));
		window.LocationManager = cordova.plugins.LocationManager;
		window.locationManager = cordova.plugins.locationManager;
		window.Regions = locationManager.Regions;

		window.Region = locationManager.Region;
		window.Delegate = locationManager.Delegate;
		window.CircularRegion = locationManager.CircularRegion;
		window.BeaconRegion = locationManager.BeaconRegion;
		app.startScan();
	},

	startScan: function() {
		var regions = [
			// Add your own manufacturer UUIDs to this list.
			{uuid:'B9407F30-F5F8-466E-AFF9-25556B57FE6D'}
		]

		var delegate = locationManager.delegate.implement({
			didDetermineStateForRegion: function (pluginResult) {
				// console.log('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
			},

			didStartMonitoringForRegion: function (pluginResult) {
				// console.log('didStartMonitoringForRegion:', pluginResult);
			},

			didRangeBeaconsInRegion: function (pluginResult) {
				// console.log('[DOM] didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult));
				var root = document.getElementById("beaconListRoot");
				for(var index in pluginResult.beacons) {
					var beacon = pluginResult.beacons[index];
					var key = 'tx'+beacon.uuid.replace(/-/g,'_') + hex16(beacon.major)+"_"+hex16(beacon.minor);
					if(beacon.proximity=="ProximityImmediate" && beacon.major==61039) {
						document.getElementById("oven").style.display = 'block';
					} else {
					}
					if(beacons[key] == null) {
						beacons[key] = beacon;
						var tr = document.createElement("tr");
					} else {
						var td = document.getElementById(key+'rssi');
						var td = document.getElementById(key+'prox');
					}
				}
			}
		});
		locationManager.setDelegate(delegate);

		for(var i in regions) {
			var uuid = regions[i].uuid;
			var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(uuid, uuid, undefined, undefined);

			cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
				.fail(console.error)
				.done();
		}
	},
};

// Set up the application.
app.initialize()
