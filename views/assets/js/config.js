const PmMixin = {};
const PmProMixin = {};
const weDevs_PM_Routers = [];
const weDevs_PM_Components = [];
const weDevsPMChildrenRouter = {};
const weDevsPmModules = [];
const weDevsPmProModules = [];

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