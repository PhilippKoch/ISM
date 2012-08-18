/* 
 * Description:
 * Date Created: 20/06/12 12:56:50
 * Author: Jennifer Falcon (falcon)
 * Comments: 
 * Version: 1
 * Change History: 
 * Arguments: 
 * Returns: 
 * Throws: 
 * Example: 
 * Type: 
 */
var audit_version = "AUDIT_ismApproval1345301367399";
var expresso_version = "eXpresso version 3.4.5 for the application 9.30.000";
var log = new system.library.expObjects.Log();
var level = log.LOG_LEVEL_INFO;

var CONST = new system.library.expConstants.Constants();
function getVersion() {return expresso_version + ", " + audit_version;}

function canIapprove(fh) {


	if (fh["assignmentGroup"] == null) {
		return false;
	}
	
	var fhGroup = new SCFile("ismGrpUsrRel");
	var sql = "usrId=\""+system.functions.operator()+"\" and grpId=\""+fh["assignmentGroup"]+"\"";
	if (RC_SUCCESS == fhGroup.doSelect(sql)) {
		return true;
	}
	
	return false;


}