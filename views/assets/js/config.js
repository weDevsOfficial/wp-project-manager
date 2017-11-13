var weDevs_PM_Routers = [];
var weDevs_PM_Components = [];
var weDevsPMChildrenRouter = {};

function weDevsPMRegisterChildrenRoute (parentRouteName, route) {
	if (weDevsPMChildrenRouter.hasOwnProperty(parentRouteName)  ) {
		weDevsPMChildrenRouter[parentRouteName].push(route);
	} else {
		weDevsPMChildrenRouter[parentRouteName] = [route];
	}
	
};

function wedevsPMGetRegisterChildrenRoute(parentRouteName, prevRoute) {
	var prevRoute = prevRoute || [];

	if (weDevsPMChildrenRouter.hasOwnProperty(parentRouteName)  ) {
		return prevRoute.concat(weDevsPMChildrenRouter[parentRouteName]);
	}
	
	return prevRoute;
}