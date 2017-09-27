<template>
	<div class="cpm-comment-form">
<br />
<font size='1'><table class='xdebug-error xe-notice' dir='ltr' border='1' cellspacing='0' cellpadding='1'>
<tr><th align='left' bgcolor='#f57900' colspan="5"><span style='background-color: #cc0000; color: #fce94f; font-size: x-large;'>( ! )</span> Notice: Undefined index: files_to_delete in /Users/mishu/Documents/wedevs/api/wp-content/plugins/cpmapi/src/Comment/Controllers/Comment_Controller.php on line <i>88</i></th></tr>
<tr><th align='left' bgcolor='#e9b96e' colspan='5'>Call Stack</th></tr>
<tr><th align='center' bgcolor='#eeeeec'>#</th><th align='left' bgcolor='#eeeeec'>Time</th><th align='left' bgcolor='#eeeeec'>Memory</th><th align='left' bgcolor='#eeeeec'>Function</th><th align='left' bgcolor='#eeeeec'>Location</th></tr>
<tr><td bgcolor='#eeeeec' align='center'>1</td><td bgcolor='#eeeeec' align='center'>0.2258</td><td bgcolor='#eeeeec' align='right'>361648</td><td bgcolor='#eeeeec'>{main}(  )</td><td title='/Users/mishu/Documents/wedevs/api/index.php' bgcolor='#eeeeec'>.../index.php<b>:</b>0</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>2</td><td bgcolor='#eeeeec' align='center'>0.2261</td><td bgcolor='#eeeeec' align='right'>363584</td><td bgcolor='#eeeeec'>require( <font color='#00bb00'>'/Users/mishu/Documents/wedevs/api/wp-blog-header.php'</font> )</td><td title='/Users/mishu/Documents/wedevs/api/index.php' bgcolor='#eeeeec'>.../index.php<b>:</b>17</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>3</td><td bgcolor='#eeeeec' align='center'>0.5592</td><td bgcolor='#eeeeec' align='right'>22033584</td><td bgcolor='#eeeeec'>wp(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-blog-header.php' bgcolor='#eeeeec'>.../wp-blog-header.php<b>:</b>16</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>4</td><td bgcolor='#eeeeec' align='center'>0.5592</td><td bgcolor='#eeeeec' align='right'>22033632</td><td bgcolor='#eeeeec'>WP->main(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/functions.php' bgcolor='#eeeeec'>.../functions.php<b>:</b>955</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>5</td><td bgcolor='#eeeeec' align='center'>0.5592</td><td bgcolor='#eeeeec' align='right'>22033632</td><td bgcolor='#eeeeec'>WP->parse_request(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp.php' bgcolor='#eeeeec'>.../class-wp.php<b>:</b>733</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>6</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22058520</td><td bgcolor='#eeeeec'>do_action_ref_array(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp.php' bgcolor='#eeeeec'>.../class-wp.php<b>:</b>386</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>7</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22058520</td><td bgcolor='#eeeeec'>WP_Hook->do_action(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/plugin.php' bgcolor='#eeeeec'>.../plugin.php<b>:</b>515</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>8</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22058520</td><td bgcolor='#eeeeec'>WP_Hook->apply_filters(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp-hook.php' bgcolor='#eeeeec'>.../class-wp-hook.php<b>:</b>323</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>9</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22059648</td><td bgcolor='#eeeeec'>rest_api_loaded(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp-hook.php' bgcolor='#eeeeec'>.../class-wp-hook.php<b>:</b>298</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>10</td><td bgcolor='#eeeeec' align='center'>0.5913</td><td bgcolor='#eeeeec' align='right'>22542336</td><td bgcolor='#eeeeec'>WP_REST_Server->serve_request(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api.php' bgcolor='#eeeeec'>.../rest-api.php<b>:</b>271</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>11</td><td bgcolor='#eeeeec' align='center'>0.5924</td><td bgcolor='#eeeeec' align='right'>22549128</td><td bgcolor='#eeeeec'>WP_REST_Server->dispatch(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api/class-wp-rest-server.php' bgcolor='#eeeeec'>.../class-wp-rest-server.php<b>:</b>329</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>12</td><td bgcolor='#eeeeec' align='center'>0.5940</td><td bgcolor='#eeeeec' align='right'>22693560</td><td bgcolor='#eeeeec'>CPM\Comment\Controllers\Comment_Controller->update(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api/class-wp-rest-server.php' bgcolor='#eeeeec'>.../class-wp-rest-server.php<b>:</b>947</td></tr>
</table></font>
<br />
<font size='1'><table class='xdebug-error xe-warning' dir='ltr' border='1' cellspacing='0' cellpadding='1'>
<tr><th align='left' bgcolor='#f57900' colspan="5"><span style='background-color: #cc0000; color: #fce94f; font-size: x-large;'>( ! )</span> Warning: Cannot modify header information - headers already sent by (output started at /Users/mishu/Documents/wedevs/api/wp-content/plugins/cpmapi/src/Comment/Controllers/Comment_Controller.php:88) in /Users/mishu/Documents/wedevs/api/wp-includes/rest-api/class-wp-rest-server.php on line <i>1266</i></th></tr>
<tr><th align='left' bgcolor='#e9b96e' colspan='5'>Call Stack</th></tr>
<tr><th align='center' bgcolor='#eeeeec'>#</th><th align='left' bgcolor='#eeeeec'>Time</th><th align='left' bgcolor='#eeeeec'>Memory</th><th align='left' bgcolor='#eeeeec'>Function</th><th align='left' bgcolor='#eeeeec'>Location</th></tr>
<tr><td bgcolor='#eeeeec' align='center'>1</td><td bgcolor='#eeeeec' align='center'>0.2258</td><td bgcolor='#eeeeec' align='right'>361648</td><td bgcolor='#eeeeec'>{main}(  )</td><td title='/Users/mishu/Documents/wedevs/api/index.php' bgcolor='#eeeeec'>.../index.php<b>:</b>0</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>2</td><td bgcolor='#eeeeec' align='center'>0.2261</td><td bgcolor='#eeeeec' align='right'>363584</td><td bgcolor='#eeeeec'>require( <font color='#00bb00'>'/Users/mishu/Documents/wedevs/api/wp-blog-header.php'</font> )</td><td title='/Users/mishu/Documents/wedevs/api/index.php' bgcolor='#eeeeec'>.../index.php<b>:</b>17</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>3</td><td bgcolor='#eeeeec' align='center'>0.5592</td><td bgcolor='#eeeeec' align='right'>22033584</td><td bgcolor='#eeeeec'>wp(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-blog-header.php' bgcolor='#eeeeec'>.../wp-blog-header.php<b>:</b>16</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>4</td><td bgcolor='#eeeeec' align='center'>0.5592</td><td bgcolor='#eeeeec' align='right'>22033632</td><td bgcolor='#eeeeec'>WP->main(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/functions.php' bgcolor='#eeeeec'>.../functions.php<b>:</b>955</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>5</td><td bgcolor='#eeeeec' align='center'>0.5592</td><td bgcolor='#eeeeec' align='right'>22033632</td><td bgcolor='#eeeeec'>WP->parse_request(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp.php' bgcolor='#eeeeec'>.../class-wp.php<b>:</b>733</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>6</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22058520</td><td bgcolor='#eeeeec'>do_action_ref_array(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp.php' bgcolor='#eeeeec'>.../class-wp.php<b>:</b>386</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>7</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22058520</td><td bgcolor='#eeeeec'>WP_Hook->do_action(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/plugin.php' bgcolor='#eeeeec'>.../plugin.php<b>:</b>515</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>8</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22058520</td><td bgcolor='#eeeeec'>WP_Hook->apply_filters(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp-hook.php' bgcolor='#eeeeec'>.../class-wp-hook.php<b>:</b>323</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>9</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22059648</td><td bgcolor='#eeeeec'>rest_api_loaded(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp-hook.php' bgcolor='#eeeeec'>.../class-wp-hook.php<b>:</b>298</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>10</td><td bgcolor='#eeeeec' align='center'>0.5913</td><td bgcolor='#eeeeec' align='right'>22542336</td><td bgcolor='#eeeeec'>WP_REST_Server->serve_request(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api.php' bgcolor='#eeeeec'>.../rest-api.php<b>:</b>271</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>11</td><td bgcolor='#eeeeec' align='center'>0.6307</td><td bgcolor='#eeeeec' align='right'>23461768</td><td bgcolor='#eeeeec'>WP_REST_Server->send_headers(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api/class-wp-rest-server.php' bgcolor='#eeeeec'>.../class-wp-rest-server.php<b>:</b>361</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>12</td><td bgcolor='#eeeeec' align='center'>0.6307</td><td bgcolor='#eeeeec' align='right'>23461768</td><td bgcolor='#eeeeec'>WP_REST_Server->send_header(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api/class-wp-rest-server.php' bgcolor='#eeeeec'>.../class-wp-rest-server.php<b>:</b>1279</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>13</td><td bgcolor='#eeeeec' align='center'>0.6307</td><td bgcolor='#eeeeec' align='right'>23462144</td><td bgcolor='#eeeeec'><a href='http://www.php.net/function.header' target='_new'>header</a>
(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api/class-wp-rest-server.php' bgcolor='#eeeeec'>.../class-wp-rest-server.php<b>:</b>1266</td></tr>
</table></font>
<br />
<font size='1'><table class='xdebug-error xe-warning' dir='ltr' border='1' cellspacing='0' cellpadding='1'>
<tr><th align='left' bgcolor='#f57900' colspan="5"><span style='background-color: #cc0000; color: #fce94f; font-size: x-large;'>( ! )</span> Warning: Cannot modify header information - headers already sent by (output started at /Users/mishu/Documents/wedevs/api/wp-content/plugins/cpmapi/src/Comment/Controllers/Comment_Controller.php:88) in /Users/mishu/Documents/wedevs/api/wp-includes/rest-api.php on line <i>551</i></th></tr>
<tr><th align='left' bgcolor='#e9b96e' colspan='5'>Call Stack</th></tr>
<tr><th align='center' bgcolor='#eeeeec'>#</th><th align='left' bgcolor='#eeeeec'>Time</th><th align='left' bgcolor='#eeeeec'>Memory</th><th align='left' bgcolor='#eeeeec'>Function</th><th align='left' bgcolor='#eeeeec'>Location</th></tr>
<tr><td bgcolor='#eeeeec' align='center'>1</td><td bgcolor='#eeeeec' align='center'>0.2258</td><td bgcolor='#eeeeec' align='right'>361648</td><td bgcolor='#eeeeec'>{main}(  )</td><td title='/Users/mishu/Documents/wedevs/api/index.php' bgcolor='#eeeeec'>.../index.php<b>:</b>0</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>2</td><td bgcolor='#eeeeec' align='center'>0.2261</td><td bgcolor='#eeeeec' align='right'>363584</td><td bgcolor='#eeeeec'>require( <font color='#00bb00'>'/Users/mishu/Documents/wedevs/api/wp-blog-header.php'</font> )</td><td title='/Users/mishu/Documents/wedevs/api/index.php' bgcolor='#eeeeec'>.../index.php<b>:</b>17</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>3</td><td bgcolor='#eeeeec' align='center'>0.5592</td><td bgcolor='#eeeeec' align='right'>22033584</td><td bgcolor='#eeeeec'>wp(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-blog-header.php' bgcolor='#eeeeec'>.../wp-blog-header.php<b>:</b>16</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>4</td><td bgcolor='#eeeeec' align='center'>0.5592</td><td bgcolor='#eeeeec' align='right'>22033632</td><td bgcolor='#eeeeec'>WP->main(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/functions.php' bgcolor='#eeeeec'>.../functions.php<b>:</b>955</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>5</td><td bgcolor='#eeeeec' align='center'>0.5592</td><td bgcolor='#eeeeec' align='right'>22033632</td><td bgcolor='#eeeeec'>WP->parse_request(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp.php' bgcolor='#eeeeec'>.../class-wp.php<b>:</b>733</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>6</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22058520</td><td bgcolor='#eeeeec'>do_action_ref_array(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp.php' bgcolor='#eeeeec'>.../class-wp.php<b>:</b>386</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>7</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22058520</td><td bgcolor='#eeeeec'>WP_Hook->do_action(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/plugin.php' bgcolor='#eeeeec'>.../plugin.php<b>:</b>515</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>8</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22058520</td><td bgcolor='#eeeeec'>WP_Hook->apply_filters(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp-hook.php' bgcolor='#eeeeec'>.../class-wp-hook.php<b>:</b>323</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>9</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22059648</td><td bgcolor='#eeeeec'>rest_api_loaded(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp-hook.php' bgcolor='#eeeeec'>.../class-wp-hook.php<b>:</b>298</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>10</td><td bgcolor='#eeeeec' align='center'>0.5913</td><td bgcolor='#eeeeec' align='right'>22542336</td><td bgcolor='#eeeeec'>WP_REST_Server->serve_request(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api.php' bgcolor='#eeeeec'>.../rest-api.php<b>:</b>271</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>11</td><td bgcolor='#eeeeec' align='center'>0.6381</td><td bgcolor='#eeeeec' align='right'>23461792</td><td bgcolor='#eeeeec'>apply_filters(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api/class-wp-rest-server.php' bgcolor='#eeeeec'>.../class-wp-rest-server.php<b>:</b>380</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>12</td><td bgcolor='#eeeeec' align='center'>0.6381</td><td bgcolor='#eeeeec' align='right'>23462192</td><td bgcolor='#eeeeec'>WP_Hook->apply_filters(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/plugin.php' bgcolor='#eeeeec'>.../plugin.php<b>:</b>203</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>13</td><td bgcolor='#eeeeec' align='center'>0.6383</td><td bgcolor='#eeeeec' align='right'>23463696</td><td bgcolor='#eeeeec'>rest_send_cors_headers(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp-hook.php' bgcolor='#eeeeec'>.../class-wp-hook.php<b>:</b>300</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>14</td><td bgcolor='#eeeeec' align='center'>0.6384</td><td bgcolor='#eeeeec' align='right'>23463824</td><td bgcolor='#eeeeec'><a href='http://www.php.net/function.header' target='_new'>header</a>
(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api.php' bgcolor='#eeeeec'>.../rest-api.php<b>:</b>551</td></tr>
</table></font>
<br />
<font size='1'><table class='xdebug-error xe-warning' dir='ltr' border='1' cellspacing='0' cellpadding='1'>
<tr><th align='left' bgcolor='#f57900' colspan="5"><span style='background-color: #cc0000; color: #fce94f; font-size: x-large;'>( ! )</span> Warning: Cannot modify header information - headers already sent by (output started at /Users/mishu/Documents/wedevs/api/wp-content/plugins/cpmapi/src/Comment/Controllers/Comment_Controller.php:88) in /Users/mishu/Documents/wedevs/api/wp-includes/rest-api.php on line <i>552</i></th></tr>
<tr><th align='left' bgcolor='#e9b96e' colspan='5'>Call Stack</th></tr>
<tr><th align='center' bgcolor='#eeeeec'>#</th><th align='left' bgcolor='#eeeeec'>Time</th><th align='left' bgcolor='#eeeeec'>Memory</th><th align='left' bgcolor='#eeeeec'>Function</th><th align='left' bgcolor='#eeeeec'>Location</th></tr>
<tr><td bgcolor='#eeeeec' align='center'>1</td><td bgcolor='#eeeeec' align='center'>0.2258</td><td bgcolor='#eeeeec' align='right'>361648</td><td bgcolor='#eeeeec'>{main}(  )</td><td title='/Users/mishu/Documents/wedevs/api/index.php' bgcolor='#eeeeec'>.../index.php<b>:</b>0</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>2</td><td bgcolor='#eeeeec' align='center'>0.2261</td><td bgcolor='#eeeeec' align='right'>363584</td><td bgcolor='#eeeeec'>require( <font color='#00bb00'>'/Users/mishu/Documents/wedevs/api/wp-blog-header.php'</font> )</td><td title='/Users/mishu/Documents/wedevs/api/index.php' bgcolor='#eeeeec'>.../index.php<b>:</b>17</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>3</td><td bgcolor='#eeeeec' align='center'>0.5592</td><td bgcolor='#eeeeec' align='right'>22033584</td><td bgcolor='#eeeeec'>wp(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-blog-header.php' bgcolor='#eeeeec'>.../wp-blog-header.php<b>:</b>16</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>4</td><td bgcolor='#eeeeec' align='center'>0.5592</td><td bgcolor='#eeeeec' align='right'>22033632</td><td bgcolor='#eeeeec'>WP->main(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/functions.php' bgcolor='#eeeeec'>.../functions.php<b>:</b>955</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>5</td><td bgcolor='#eeeeec' align='center'>0.5592</td><td bgcolor='#eeeeec' align='right'>22033632</td><td bgcolor='#eeeeec'>WP->parse_request(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp.php' bgcolor='#eeeeec'>.../class-wp.php<b>:</b>733</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>6</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22058520</td><td bgcolor='#eeeeec'>do_action_ref_array(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp.php' bgcolor='#eeeeec'>.../class-wp.php<b>:</b>386</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>7</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22058520</td><td bgcolor='#eeeeec'>WP_Hook->do_action(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/plugin.php' bgcolor='#eeeeec'>.../plugin.php<b>:</b>515</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>8</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22058520</td><td bgcolor='#eeeeec'>WP_Hook->apply_filters(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp-hook.php' bgcolor='#eeeeec'>.../class-wp-hook.php<b>:</b>323</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>9</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22059648</td><td bgcolor='#eeeeec'>rest_api_loaded(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp-hook.php' bgcolor='#eeeeec'>.../class-wp-hook.php<b>:</b>298</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>10</td><td bgcolor='#eeeeec' align='center'>0.5913</td><td bgcolor='#eeeeec' align='right'>22542336</td><td bgcolor='#eeeeec'>WP_REST_Server->serve_request(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api.php' bgcolor='#eeeeec'>.../rest-api.php<b>:</b>271</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>11</td><td bgcolor='#eeeeec' align='center'>0.6381</td><td bgcolor='#eeeeec' align='right'>23461792</td><td bgcolor='#eeeeec'>apply_filters(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api/class-wp-rest-server.php' bgcolor='#eeeeec'>.../class-wp-rest-server.php<b>:</b>380</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>12</td><td bgcolor='#eeeeec' align='center'>0.6381</td><td bgcolor='#eeeeec' align='right'>23462192</td><td bgcolor='#eeeeec'>WP_Hook->apply_filters(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/plugin.php' bgcolor='#eeeeec'>.../plugin.php<b>:</b>203</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>13</td><td bgcolor='#eeeeec' align='center'>0.6383</td><td bgcolor='#eeeeec' align='right'>23463696</td><td bgcolor='#eeeeec'>rest_send_cors_headers(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp-hook.php' bgcolor='#eeeeec'>.../class-wp-hook.php<b>:</b>300</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>14</td><td bgcolor='#eeeeec' align='center'>0.6405</td><td bgcolor='#eeeeec' align='right'>23463744</td><td bgcolor='#eeeeec'><a href='http://www.php.net/function.header' target='_new'>header</a>
(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api.php' bgcolor='#eeeeec'>.../rest-api.php<b>:</b>552</td></tr>
</table></font>
<br />
<font size='1'><table class='xdebug-error xe-warning' dir='ltr' border='1' cellspacing='0' cellpadding='1'>
<tr><th align='left' bgcolor='#f57900' colspan="5"><span style='background-color: #cc0000; color: #fce94f; font-size: x-large;'>( ! )</span> Warning: Cannot modify header information - headers already sent by (output started at /Users/mishu/Documents/wedevs/api/wp-content/plugins/cpmapi/src/Comment/Controllers/Comment_Controller.php:88) in /Users/mishu/Documents/wedevs/api/wp-includes/rest-api.php on line <i>553</i></th></tr>
<tr><th align='left' bgcolor='#e9b96e' colspan='5'>Call Stack</th></tr>
<tr><th align='center' bgcolor='#eeeeec'>#</th><th align='left' bgcolor='#eeeeec'>Time</th><th align='left' bgcolor='#eeeeec'>Memory</th><th align='left' bgcolor='#eeeeec'>Function</th><th align='left' bgcolor='#eeeeec'>Location</th></tr>
<tr><td bgcolor='#eeeeec' align='center'>1</td><td bgcolor='#eeeeec' align='center'>0.2258</td><td bgcolor='#eeeeec' align='right'>361648</td><td bgcolor='#eeeeec'>{main}(  )</td><td title='/Users/mishu/Documents/wedevs/api/index.php' bgcolor='#eeeeec'>.../index.php<b>:</b>0</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>2</td><td bgcolor='#eeeeec' align='center'>0.2261</td><td bgcolor='#eeeeec' align='right'>363584</td><td bgcolor='#eeeeec'>require( <font color='#00bb00'>'/Users/mishu/Documents/wedevs/api/wp-blog-header.php'</font> )</td><td title='/Users/mishu/Documents/wedevs/api/index.php' bgcolor='#eeeeec'>.../index.php<b>:</b>17</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>3</td><td bgcolor='#eeeeec' align='center'>0.5592</td><td bgcolor='#eeeeec' align='right'>22033584</td><td bgcolor='#eeeeec'>wp(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-blog-header.php' bgcolor='#eeeeec'>.../wp-blog-header.php<b>:</b>16</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>4</td><td bgcolor='#eeeeec' align='center'>0.5592</td><td bgcolor='#eeeeec' align='right'>22033632</td><td bgcolor='#eeeeec'>WP->main(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/functions.php' bgcolor='#eeeeec'>.../functions.php<b>:</b>955</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>5</td><td bgcolor='#eeeeec' align='center'>0.5592</td><td bgcolor='#eeeeec' align='right'>22033632</td><td bgcolor='#eeeeec'>WP->parse_request(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp.php' bgcolor='#eeeeec'>.../class-wp.php<b>:</b>733</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>6</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22058520</td><td bgcolor='#eeeeec'>do_action_ref_array(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp.php' bgcolor='#eeeeec'>.../class-wp.php<b>:</b>386</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>7</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22058520</td><td bgcolor='#eeeeec'>WP_Hook->do_action(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/plugin.php' bgcolor='#eeeeec'>.../plugin.php<b>:</b>515</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>8</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22058520</td><td bgcolor='#eeeeec'>WP_Hook->apply_filters(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp-hook.php' bgcolor='#eeeeec'>.../class-wp-hook.php<b>:</b>323</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>9</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22059648</td><td bgcolor='#eeeeec'>rest_api_loaded(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp-hook.php' bgcolor='#eeeeec'>.../class-wp-hook.php<b>:</b>298</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>10</td><td bgcolor='#eeeeec' align='center'>0.5913</td><td bgcolor='#eeeeec' align='right'>22542336</td><td bgcolor='#eeeeec'>WP_REST_Server->serve_request(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api.php' bgcolor='#eeeeec'>.../rest-api.php<b>:</b>271</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>11</td><td bgcolor='#eeeeec' align='center'>0.6381</td><td bgcolor='#eeeeec' align='right'>23461792</td><td bgcolor='#eeeeec'>apply_filters(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api/class-wp-rest-server.php' bgcolor='#eeeeec'>.../class-wp-rest-server.php<b>:</b>380</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>12</td><td bgcolor='#eeeeec' align='center'>0.6381</td><td bgcolor='#eeeeec' align='right'>23462192</td><td bgcolor='#eeeeec'>WP_Hook->apply_filters(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/plugin.php' bgcolor='#eeeeec'>.../plugin.php<b>:</b>203</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>13</td><td bgcolor='#eeeeec' align='center'>0.6383</td><td bgcolor='#eeeeec' align='right'>23463696</td><td bgcolor='#eeeeec'>rest_send_cors_headers(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp-hook.php' bgcolor='#eeeeec'>.../class-wp-hook.php<b>:</b>300</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>14</td><td bgcolor='#eeeeec' align='center'>0.6424</td><td bgcolor='#eeeeec' align='right'>23463744</td><td bgcolor='#eeeeec'><a href='http://www.php.net/function.header' target='_new'>header</a>
(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api.php' bgcolor='#eeeeec'>.../rest-api.php<b>:</b>553</td></tr>
</table></font>
<br />
<font size='1'><table class='xdebug-error xe-warning' dir='ltr' border='1' cellspacing='0' cellpadding='1'>
<tr><th align='left' bgcolor='#f57900' colspan="5"><span style='background-color: #cc0000; color: #fce94f; font-size: x-large;'>( ! )</span> Warning: Cannot modify header information - headers already sent by (output started at /Users/mishu/Documents/wedevs/api/wp-content/plugins/cpmapi/src/Comment/Controllers/Comment_Controller.php:88) in /Users/mishu/Documents/wedevs/api/wp-includes/rest-api.php on line <i>554</i></th></tr>
<tr><th align='left' bgcolor='#e9b96e' colspan='5'>Call Stack</th></tr>
<tr><th align='center' bgcolor='#eeeeec'>#</th><th align='left' bgcolor='#eeeeec'>Time</th><th align='left' bgcolor='#eeeeec'>Memory</th><th align='left' bgcolor='#eeeeec'>Function</th><th align='left' bgcolor='#eeeeec'>Location</th></tr>
<tr><td bgcolor='#eeeeec' align='center'>1</td><td bgcolor='#eeeeec' align='center'>0.2258</td><td bgcolor='#eeeeec' align='right'>361648</td><td bgcolor='#eeeeec'>{main}(  )</td><td title='/Users/mishu/Documents/wedevs/api/index.php' bgcolor='#eeeeec'>.../index.php<b>:</b>0</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>2</td><td bgcolor='#eeeeec' align='center'>0.2261</td><td bgcolor='#eeeeec' align='right'>363584</td><td bgcolor='#eeeeec'>require( <font color='#00bb00'>'/Users/mishu/Documents/wedevs/api/wp-blog-header.php'</font> )</td><td title='/Users/mishu/Documents/wedevs/api/index.php' bgcolor='#eeeeec'>.../index.php<b>:</b>17</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>3</td><td bgcolor='#eeeeec' align='center'>0.5592</td><td bgcolor='#eeeeec' align='right'>22033584</td><td bgcolor='#eeeeec'>wp(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-blog-header.php' bgcolor='#eeeeec'>.../wp-blog-header.php<b>:</b>16</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>4</td><td bgcolor='#eeeeec' align='center'>0.5592</td><td bgcolor='#eeeeec' align='right'>22033632</td><td bgcolor='#eeeeec'>WP->main(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/functions.php' bgcolor='#eeeeec'>.../functions.php<b>:</b>955</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>5</td><td bgcolor='#eeeeec' align='center'>0.5592</td><td bgcolor='#eeeeec' align='right'>22033632</td><td bgcolor='#eeeeec'>WP->parse_request(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp.php' bgcolor='#eeeeec'>.../class-wp.php<b>:</b>733</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>6</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22058520</td><td bgcolor='#eeeeec'>do_action_ref_array(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp.php' bgcolor='#eeeeec'>.../class-wp.php<b>:</b>386</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>7</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22058520</td><td bgcolor='#eeeeec'>WP_Hook->do_action(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/plugin.php' bgcolor='#eeeeec'>.../plugin.php<b>:</b>515</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>8</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22058520</td><td bgcolor='#eeeeec'>WP_Hook->apply_filters(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp-hook.php' bgcolor='#eeeeec'>.../class-wp-hook.php<b>:</b>323</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>9</td><td bgcolor='#eeeeec' align='center'>0.5598</td><td bgcolor='#eeeeec' align='right'>22059648</td><td bgcolor='#eeeeec'>rest_api_loaded(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp-hook.php' bgcolor='#eeeeec'>.../class-wp-hook.php<b>:</b>298</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>10</td><td bgcolor='#eeeeec' align='center'>0.5913</td><td bgcolor='#eeeeec' align='right'>22542336</td><td bgcolor='#eeeeec'>WP_REST_Server->serve_request(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api.php' bgcolor='#eeeeec'>.../rest-api.php<b>:</b>271</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>11</td><td bgcolor='#eeeeec' align='center'>0.6381</td><td bgcolor='#eeeeec' align='right'>23461792</td><td bgcolor='#eeeeec'>apply_filters(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api/class-wp-rest-server.php' bgcolor='#eeeeec'>.../class-wp-rest-server.php<b>:</b>380</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>12</td><td bgcolor='#eeeeec' align='center'>0.6381</td><td bgcolor='#eeeeec' align='right'>23462192</td><td bgcolor='#eeeeec'>WP_Hook->apply_filters(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/plugin.php' bgcolor='#eeeeec'>.../plugin.php<b>:</b>203</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>13</td><td bgcolor='#eeeeec' align='center'>0.6383</td><td bgcolor='#eeeeec' align='right'>23463696</td><td bgcolor='#eeeeec'>rest_send_cors_headers(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/class-wp-hook.php' bgcolor='#eeeeec'>.../class-wp-hook.php<b>:</b>300</td></tr>
<tr><td bgcolor='#eeeeec' align='center'>14</td><td bgcolor='#eeeeec' align='center'>0.6439</td><td bgcolor='#eeeeec' align='right'>23463744</td><td bgcolor='#eeeeec'><a href='http://www.php.net/function.header' target='_new'>header</a>
(  )</td><td title='/Users/mishu/Documents/wedevs/api/wp-includes/rest-api.php' bgcolor='#eeeeec'>.../rest-api.php<b>:</b>554</td></tr>
</table></font>
		<form class="cpm-comment-form-vue" @submit.prevent="updateComment()">

	        <div class="item message cpm-sm-col-1">
	            <text-editor :editor_id="editor_id" :content="content"></text-editor>
	        </div>
	        <!-- <file-uploader :files="files"></file-uploader> -->

	        <div v-if="hasCoWorker" class="notify-users">
	                        
	                <h2 class="cpm-box-title"> 
	                    Notify users            
	                    <label class="cpm-small-title" for="select-all"> 
	                        <input @change.prevent="notify_all_coo_worker()" type="checkbox" v-model="notify_all_co_worker" id="select-all" class="cpm-toggle-checkbox"> 
	                        Select all
	                    </label>
	                </h2>

	                <ul class="cpm-user-list">
	                    <li v-for="co_worker in co_workers" :key="co_worker.id">
	                        <label :for="'cpm_notify_' + co_worker.id">
	                            <input @change.prevent="notify_coo_workers( co_worker.id )" type="checkbox" v-model="notify_co_workers" name="notify_co_workers[]" :value="co_worker.id" :id="'cpm_notify_' + co_worker.id" > 
	                            {{ co_worker.name }}
	                        </label>
	                    </li>

	                    <div class="clearfix"></div>
	                </ul>
	        </div>
	        
	        <div class="submit">
	            <input v-if="!comment.edit_mode" :disabled="submit_disabled" type="submit" class="button-primary"  value="Add New Comment" id="" />
	            <input v-if="comment.edit_mode" :disabled="submit_disabled" type="submit" class="button-primary"  value="Update Comment" id="" />
	            <span v-show="show_spinner" class="cpm-spinner"></span>
	        </div>
	    </form>
	</div>
</template>

<script>
	import editor from './text-editor.vue';
	import file_uploader from './file-uploader.vue';

	export default {
	    // Get passing data for this component. 
	    props: ['comment', 'list'],

	    /**
	     * Initial data for this component
	     * 
	     * @return obj
	     */
	    data: function() {
	        return {
	            files: typeof this.comment.files == 'undefined' ? [] : this.comment.files,
	            content: {
	                html: typeof this.comment.content == 'undefined' ? '' : this.comment.content,
	            },
	            notify_co_workers: [],
	            notify_all_co_worker: false,
	            show_spinner: false,
	            submit_disabled: false,
	        }
	    },

	    /**
	     * Observe onchange value
	     */
	    watch: {
	        /**
	         * Observed comment file change
	         * 
	         * @param  array new_files 
	         * 
	         * @return void           
	         */
	        files: function( new_files ) {
	            this.comment.files = new_files;
	        },

	        /**
	         * Observe onchange comment message
	         *
	         * @param string new_content 
	         * 
	         * @type void
	         */
	        content: {
	            handler: function( new_content ) {
	                this.comment.content = new_content.html;
	            },

	            deep: true
	        },

	    },

	    components: {
	    	'text-editor': editor,
	    	'file-uploader': file_uploader
	    },

	    /**
	     * Unassigned varable value
	     */
	    computed: {
	        /**
	         * Editor ID
	         * 
	         * @return string
	         */
	        editor_id: function() {
	            var comment_id = ( typeof this.comment.id == 'undefined' ) ? 
	                '' : '-' + this.comment.id;
	            return 'cpm-list-editor' + comment_id;
	        },

	        /**
	         * Get current projects co-worker
	         * 
	         * @return object
	         */
	        co_workers: function() {
	            return this.get_porject_users_by_role('co_worker');
	        },

	        /**
	         * Check has co-worker in project or not
	         * 
	         * @return boolean
	         */
	        hasCoWorker: function() {
	            var co_worker = this.get_porject_users_by_role('co_worker');

	            if (co_worker.length) {
	                return true;
	            }

	            return false;
	        }
	    },

	    methods: {
	        /**
	         * Insert and update todo-list comment
	         * 
	         * @return void
	         */
	        updateComment: function() {
	            // Prevent sending request when multiple click submit button 
	            if ( this.submit_disabled ) {
	                return;
	            }

	            // Make disable submit button
	            this.submit_disabled = true;

	            var self      = this,
	                is_update = typeof this.comment.id == 'undefined' ? false : true,
	                form_data = {
	                	commentable_type: 'task-list',
	                    content: this.comment.content,
	                    commentable_id: self.$route.params.list_id,
	                };

	            if (is_update) {
	            	var url = self.base_url + '/cpm/v2/projects/'+self.project_id+'/comments/'+this.comment.id+'?content='+this.comment.content;
	            	var type = "PUT";
	            } else {
	            	var url = self.base_url + '/cpm/v2/projects/'+self.project_id+'/comments';
	            	var type = "POST";
	            }
	            // Showing spinner    
	            this.show_spinner = true;

	            var request_data = {
	            	url: url,
	            	type: type,
	            	data: form_data,
	            	success (res) { 
	            		self.addListCommentMeta(res.data);
	            		self.showHideListCommentEditForm (self.comment);
                        if (is_update) {
                        	self.$store.commit('listUpdateComment', {
                        		list_id: self.$route.params.list_id,
                        		comment_id: self.comment.id,
                        		comment: res.data
                        	});
                        } else {
                        	self.$store.commit('listNewComment', {
                        		list_id: self.$route.params.list_id,
                        		comment: res.data
                        	});
                        }
	            		self.submit_disabled = false;
	            	},
	            	error (res) {
	            		self.submit_disabled = false;
	            	}
	            }

	            self.httpRequest(request_data);

	        },

	        /**
	         * Get files id array from file object
	         * 
	         * @param  object files 
	         * 
	         * @return array       
	         */
	        filtersOnlyFileID: function( files ) {
	            if ( typeof files == 'undefined' ) {
	                return [];
	            }

	            return files.map( function( file ) {
	                return file.id;
	            });
	        },

	        /**
	         * Check select all check box enable or disabled. for notify users
	         * 
	         * @param  int user_id 
	         * 
	         * @return void         
	         */
	        notify_coo_workers: function( user_id ) {
	            var co_worker_length = this.get_porject_users_id_by_role('co_worker').length,
	                notify_co_worker_length = this.notify_co_workers.length;
	            
	            if ( co_worker_length != notify_co_worker_length ) {
	                this.notify_all_co_worker = false;
	            }

	            if ( co_worker_length === notify_co_worker_length ) {
	                this.notify_all_co_worker = true;
	            }
	        },

	        /**
	         * Is notification send all co-worker or not
	         */
	        notify_all_coo_worker: function() {

	            if ( this.notify_all_co_worker ) {
	                this.notify_co_workers = [];
	                this.notify_co_workers = this.get_porject_users_id_by_role('co_worker');
	            } else {
	                this.notify_co_workers = [];
	            }
	        },
	    }
	}
</script>

