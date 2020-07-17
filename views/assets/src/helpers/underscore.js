import * as allUnderscore  from 'underscore';

if(typeof _ != 'undefined') {
	for ( var underscoreProperty in allUnderscore ) {
	    _[underscoreProperty] = allUnderscore[underscoreProperty];
	}
}

