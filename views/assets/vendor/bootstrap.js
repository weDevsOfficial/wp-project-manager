window.pm = {};
const PmMixin = {};
const PmProMixin = {};
const PmProComment = {};
const weDevs_PM_Routers = [];
const weDevs_PM_Components = [];
const weDevsPMChildrenRouter = {};
const weDevsPmModules = [];
const weDevsPmProModules = [];
const weDevsPmProAddonModules = [];
const WeDevsfilters = {};
var pmProjects = [];

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
    WeDevsfilters[tag] = WeDevsfilters[ tag ] || [];
    WeDevsfilters[tag].push( { priority: priority, callback: callback } );
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

    if( typeof WeDevsfilters[tag] !== "undefined" && WeDevsfilters[tag].length > 0 ) {

        WeDevsfilters[tag].forEach( function( hook ) {

            filters[hook.priority] = filters[hook.priority] || [];
            filters[hook.priority].push( hook.callback );
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
    if(typeof WeDevsfilters[ tag ] === 'undefined' ) {
        return;
    }
    WeDevsfilters[ tag ].forEach( function( filter, i ) {
        if( filter.callback.name === callback ) {
            WeDevsfilters[ tag ].splice(i, 1);
        }
    } );
}

function pmGetIndex( itemList, id, slug) {
    var index = false;

    jQuery.each(itemList, function(key, item) {

        if (item[slug] == id) {
            index = key;
        }
    });

    return index;
}
function pmUserCan(cap, project, user) {
    user    = user || PM_Vars.current_user;

    if ( pmHasManageCapability() ) {
        return true;
    }

    if ( ! pmIsUserInProject(project, user) ) {
        return false;
    }

    if( pmIsManager(project, user) ) {
        return true;
    }

    var role = pmGetRole(project, user);

    if ( !role ) {
        return false;
    }

    var role_caps = pmGetRoleCaps( project, role );

    if ( !Object.keys(role_caps).length  ) {
        return true;
    }

    if ( 
        role_caps.hasOwnProperty(cap) 
        &&
        (
            role_caps[cap] === true
            ||
            role_caps[cap] === 'true'
        )
    ) {
        return true;
    }

    return false;

}

function pmGetRoleCaps (project, role) {
    var default_project = {
        capabilities: {}
    },
    project = jQuery.extend(true, default_project, project );
    
    if( project.capabilities.hasOwnProperty(role) ) {
        return project.capabilities[role];
    } else {
        return [];
    }
}

function pmGetRole (project, user) {
    user    = user || PM_Vars.current_user;

    var default_project = {
        assignees: {
            data: []
        }
    },
    project = jQuery.extend(true, default_project, project );

    var index = pmGetIndex( project.assignees.data, user.ID, 'id' );

    if ( index === false ) {
        return false;
    }

    var project_user = project.assignees.data[index];
    
    return project_user.roles.data.length ? project_user.roles.data[0].slug : false;
}

function pmIsUserInProject (project, user) {
    var user    = user || PM_Vars.current_user;
    var user_id = user.ID;
    var default_project = {
        assignees: {
            data: []
        }
    },
    project = jQuery.extend(true, default_project, project );
    
    var index = pmGetIndex(project.assignees.data, user_id, 'id');

    if ( index === false ) {
        return false;
    }

    return true;
}
function pmIsManager (project, user) {
    user    = user || PM_Vars.current_user;

    if (pmHasManageCapability()){
        return true;
    }
    if ( !project ){
        return false;
    }
    var default_project = {
        assignees: {
            data: []
        }
    },
    project = jQuery.extend(true, default_project, project );

    var index = pmGetIndex( project.assignees.data, user.ID, 'id' );
    ( project.assignees.data, user.ID, 'id' );

    if ( index === false ) {
        return false;
    }

    var project_user = project.assignees.data[index];
    var role_index   = pmGetIndex( project_user.roles.data, 'manager', 'slug' );

    if ( role_index !== false ) {
        return true;
    }

    return false;
}

function pmHasManageCapability () {
    if ( PM_Vars.manage_capability === '1' ){
        return true;
    }
    return false;
}
function pmHasCreateCapability () {
    if ( PM_Vars.manage_capability === '1' ){
        return true;
    }
    if ( PM_Vars.create_capability === '1' ){
        return true;
    }
    return false; 
}
