/* 
 * Description:
 * Date Created: 18/06/2012 15:27:25
 * Author: Thomas Olsen (to)
 * Comments: 
 * Version: 1
 * Change History: 
 * Arguments: 
 * Returns: 
 * Throws: 
 * Example: 
 * Type: 
 */
var audit_version = "AUDIT_ismButtonLabels1345301369676";
var expresso_version = "eXpresso version 3.4.5 for the application 9.30.000";
var log = new system.library.expObjects.Log();
var level = log.LOG_LEVEL_INFO;


 
 
function Constants() {

 	var labelsHm = lib.expObjects.Hashtable();
 
// IM Button Labels
	labelsHm.put("IMsubmit"		,"Submit");	

 	this.labels = labelsHm;
 	
}

function get(name) {
	return this[name];
}

