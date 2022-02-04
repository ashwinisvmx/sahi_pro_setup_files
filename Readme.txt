After installing Sahi pro in the location "\auto\sahi_pro" do the following:


Rename the files "browser_types_WIN.xml" & "browser_types_MAC.xml" based on WIN or MAC to "browser_types.xml"

Copy the file "browser_types.xml"  to the location "\auto\sahi_pro\userdata\config"

Copy the file "donot_download_urls.txt" to the location "\auto\sahi_pro\userdata\config"

Copy the file "userdata.properties" to the location "\auto\sahi_pro\userdata\config"

Copy the file "substitutions.xml" o the location "\auto\sahi_pro\userdata\config"

Copy the file "custom_html.json" to the location "\auto\sahi_pro\userdata\config\accessor_metadata"

Copy the file "sfl451" to the location "\auto\sahi_pro\htdocs\spr\"

Copy the file "flex.json" to the location "\auto\sahi_pro\config\accessor_metadata"

Copy the file "testrunner.sh" & "testrunner.bat" to the location "auto\sahi_pro\userdata\bin"



** FOR FSA WINDOWS ONLY:
========================================================
- Please add the following function in <SahiPro>/htdocs/spr/lib.js file.
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

Sahi.prototype.getSessionIds = function(title){
	var session = Packages.net.sf.sahi.session.Session;
	var sessions = session.getSessions();
	var sIds = [];
    for (var s in Iterator(sessions.values())) {
    	var sId = s.id();
    	var windowsData = s.getWindowsToJSON(1000);
    	windowsData = eval("("+windowsData+")");
    	for(var i=0; i<windowsData.length; i++){
    		var w = windowsData[i];
    		var windowTitle = w.windowTitle;
			if(title == windowTitle){
    			sIds.push(sId);
    			continue;
    		}
    	}
    }
    return sIds;
};

*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
========================================================
- Add the following content on TOP under <Head> in <ServiceMax>/js/index.html
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

<!--SAHI_INJECT_START-->
<script src="http://sahi.example.com/_s_/sprc/concat.js,assert.js,listen.js,async.js,actions.js,touch.js,sfl.js,language_pack.js" id='_sahi_concat'></script>
<script src="http://sahi.example.com/_s_/dyn/SessionState_config/sahiconfig.js"></script>
<!--extra_js_placeholder-->
<!--selenium_js_placeholder-->
<!--SAHI_INJECT_END-->

*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
========================================================
- Please apply the below changes "<Service Max>\Laptop Mobile.exe.config" file:
- Insert in the <system.net> tag in Laptop Mobile.exe.config file.
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

<defaultProxy>
<proxy
usesystemdefault="true"
proxyaddress="http://127.0.0.1:9999"
bypassonlocal="true"
/>
<bypasslist>
<add address=".*salesforce.com" />
</bypasslist>
</defaultProxy>

*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
========================================================
