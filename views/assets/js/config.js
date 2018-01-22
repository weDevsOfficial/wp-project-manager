const PmMixin = {};
const PmProMixin = {};
const weDevs_PM_Routers = [];
const weDevs_PM_Components = [];
const weDevsPMChildrenRouter = {};
const weDevsPmModules = [];
const weDevsPmProModules = [];
const weDevsPmProAddonModules = [];
const WeDevsfilters = {}; 

function weDevsPMRegisterChildrenRoute (parentRouteName, routes) {
	routes.forEach(function(route) {
		if (weDevsPMChildrenRouter.hasOwnProperty(parentRouteName)  ) {
			weDevsPMChildrenRouter[parentRouteName].push(route);
		} else {
			weDevsPMChildrenRouter[parentRouteName] = [route];
		}
	});
};

function wedevsPMGetRegisterChildrenRoute(parentRouteName, prevRoute) {
	var prevRoute = prevRoute || [];

	if (weDevsPMChildrenRouter.hasOwnProperty(parentRouteName)  ) {
		return prevRoute.concat(weDevsPMChildrenRouter[parentRouteName]);
	}
	
	return prevRoute;
}

function weDevsPmRegisterModule(module, path) {
	weDevsPmModules.push(
		{
			'name': module,
			'path': path
		}
	);
}

function weDevsPmProRegisterModule(module, path) {
	weDevsPmProModules.push(
		{
			'name': module,
			'path': path
		}
	);
}

function weDevsPmProAddonRegisterModule(module, path) {
	weDevsPmProAddonModules.push(
		{
			'name': module,
			'path': path
		}
	);
}

/**
 * Add a new Filter callback to Hooks.filters
 *
 * @param tag The tag specified by apply_filters()
 * @param callback The callback function to call when apply_filters() is called
 * @param priority Priority of filter to apply. Default: 10 (like WordPress)
 */
function pm_add_filter( tag, callback, priority ) {

    if( typeof priority === "undefined" ) {
        priority = 10;
    }

    // If the tag doesn't exist, create it.
    WeDevsfilters[ tag ] = WeDevsfilters[ tag ] || [];
    WeDevsfilters[ tag ].push( { priority: priority, callback: callback } );

}

/**
 * Calls filters that are stored in Hooks.filters for a specific tag or return
 * original value if no filters exist.
 *
 * @param tag A registered tag in Hook.filters
 * @options Optional JavaScript object to pass to the callbacks
 */
function pm_apply_filters ( tag, value, options ) {

    var filters = [];

    if( typeof WeDevsfilters[ tag ] !== "undefined" && WeDevsfilters[ tag ].length > 0 ) {

        WeDevsfilters[ tag ].forEach( function( hook ) {

            filters[ hook.priority ] = filters[ hook.priority ] || [];
            filters[ hook.priority ].push( hook.callback );
        } );

        filters.forEach( function( hooks ) {

            hooks.forEach( function( callback ) {
                value = callback( value, options );
            } );

        } );
    }

    return value;
}

/**
 * Remove a Filter callback from Hooks.filters
 *
 * Must be the exact same callback signature.
 * Warning: Anonymous functions can not be removed.
 * @param tag The tag specified by apply_filters()
 * @param callback The callback function to remove
 */
function pm_remove_filter( tag, callback ) {

    WeDevsfilters[ tag ] = Hooks.filters[ tag ] || [];

    WeDevsfilters[ tag ].forEach( function( filter, i ) {
        if( filter.callback === callback ) {
            WeDevsfilters[ tag ].splice(i, 1);
        }
    } );
}