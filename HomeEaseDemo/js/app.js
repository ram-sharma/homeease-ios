// JavaScript code for the Arduino Beacon example app.

// Application object.
var app = {}

// Regions that define which page to show for each beacon.
app.beaconRegions =
[
	{
		id: 'oven',
		// uuid:'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
		uuid:'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
		major: 61039,
		minor: 63028
	}
]
app.currentPage = 'test'
app.initialize = function()
{
	document.addEventListener(
		'deviceready',
		app.onDeviceReady,
		false)
	app.gotoPage(app.currentPage)
}

// Called when Cordova are plugins initialised,
// the iBeacon API is now available.
app.onDeviceReady = function()
{
	// Specify a shortcut for the location manager holding the iBeacon functions.
	window.locationManager = cordova.plugins.locationManager

	// Start tracking beacons!
	app.startScanForBeacons()
}

app.startScanForBeacons = function()
{
	//console.log('startScanForBeacons')

	// The delegate object contains iBeacon callback functions.
	var delegate = locationManager.delegate.implement(
	{
		didDetermineStateForRegion: function(pluginResult)
		{
			//console.log('didDetermineStateForRegion: ' + JSON.stringify(pluginResult))
		},

		didStartMonitoringForRegion: function(pluginResult)
		{
			//console.log('didStartMonitoringForRegion:' + JSON.stringify(pluginResult))
		},

		didRangeBeaconsInRegion: function(pluginResult)
		{
			//console.log('didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult))
			app.didRangeBeaconsInRegion(pluginResult)
		}
	})

	// Set the delegare object to use.
	locationManager.setDelegate(delegate)

	// Start monitoring and ranging our beacons.
	for (var r in app.beaconRegions)
	{
		var region = app.beaconRegions[r]

		var beaconRegion = new locationManager.BeaconRegion(
			region.id, region.uuid, region.major, region.minor)

		// Start monitoring.
		locationManager.startMonitoringForRegion(beaconRegion)
			.fail(console.error)
			.done()

		// Start ranging.
		locationManager.startRangingBeaconsInRegion(beaconRegion)
			.fail(console.error)
			.done()
	}
}

// Display pages depending of which beacon is close.
app.didRangeBeaconsInRegion = function(pluginResult)
{
	// There must be a beacon within range.
	if (0 == pluginResult.beacons.length)
	{
		return
	}

	// Our regions are defined so that there is one beacon per region.
	// Get the first (and only) beacon in range in the region.
	var beacon = pluginResult.beacons[0]

	// The region identifier is the page id.
	var pageId = pluginResult.region.identifier

	//console.log('ranged beacon: ' + pageId + ' ' + beacon.proximity)

	// If the beacon is close and represents a new page, then show the page.
	if ((beacon.proximity == 'ProximityImmediate' || beacon.proximity == 'ProximityNear')
		&& app.currentPage != pageId)
	{
		app.gotoPage(pageId)
		return
	}

	// If the beacon represents the current page but is far away,
	// then show the default page.
	if ((beacon.proximity == 'ProximityFar' || beacon.proximity == 'ProximityUnknown')
		&& app.currentPage == pageId)
	{
		app.gotoPage('page-default')
		return
	}
}

app.gotoPage = function(pageId)
{
	if(pageId=="oven") {
		document.getElementById("debug").value = 5;
		document.getElementById("oven").style.display = 'block';
	} else {
		document.getElementById("debug").value = pageId;
		document.getElementById("oven").style.display = 'none';
	}
}

// Set up the application.
app.initialize()
