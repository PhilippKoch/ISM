/* 
 * Description:
 * Date Created: 18/06/12 17:13:39
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

var CONST = new system.library.expConstants.Constants();
function getVersion() {return expresso_version + ", " + audit_version;}

var audit_version = "AUDIT_ismActivityUpdates1345301357274";
var expresso_version = "eXpresso version 3.4.5 for the application 9.30.000";
var log = new system.library.expObjects.Log();
var level = log.LOG_LEVEL_INFO;

function getVersion() {return expresso_version + ", " + audit_version;}

// DEV TAG END
/* Description:
 *   This function sets the Updated External flag on the record which received an email update
 * Date created: 20100201 
 * Author: Michael Kristensen (mbk@globicon.dk)
 * Comments:
 * Version: 1.00
 * Change History:
 *   1.00: EXPIM100104-MK-20100201, mbk@globicon.dk: added
 *	 1.10: EXP920-mbk-20101019, changed to use the update queue instead of old Grethe Synch, since this was causing validation errors from ess	
 * Type: Public
 * Arguments:
 *   Filehandle:record, the record from expmail passed in
 * Returns:
 *   n/a
 * Throws:
 *   n/a
 */
/* Description:
 *   This function can be used to add an activity to a file
 * Date created: 20100203
 * Author: Michael Kristensen (mbk@globicon.dk)
 * Comments:
 * Version: 1.00
 * Change History:
 *   1.00: EXPIM100104-MK-20100203, mbk@globicon.dk: added
 * Type: Public
 * Arguments:
 *   String:filename, the filename that we would like to add an activity to (i.e. incidents, probsummary, expWorkorder, etc.)
 *   String:id, the id of the record to add the activity to
 *	 String:type, the activity type (Update, Closed, etc.)
 *	 String;text, the activity text
 *	 String:operator (optional), the operator which logs the activity (set to current logged on if null... watch out for background)
 *	 Boolean:custvisible, flag on whether this should be visible for customers (via ESS) or not
 * Returns:
 *   n/a
 * Throws:
 *   n/a
 */
function addActivityRecord(filename, id, type, text, operator, custvisible) {
	log.debug(level, "expActivityUpdates::addActivityRecord --> START");	
	log.debug(level, "expActivityUpdates::addActivityRecord --> filename = "+filename);		
	log.debug(level, "expActivityUpdates::addActivityRecord --> id = " + id);		
	log.debug(level, "expActivityUpdates::addActivityRecord --> type = " + type);		
	log.debug(level, "expActivityUpdates::addActivityRecord --> text = " + text);					
	log.debug(level, "expActivityUpdates::addActivityRecord --> operator = " + operator);					
	log.debug(level, "expActivityUpdates::addActivityRecord --> custvisible = " + custvisible);					
	
	var activityFilename = returnActivityFilename(filename);
	log.debug(level, "expActivityUpdates::addActivityRecord --> activityFilename = "+activityFilename);		

	var activity = new SCFile(activityFilename);
	nextNumber = system.library.expfunctions.getNumber(activityFilename);
	log.debug(level, "expActivityUpdates::addActivityRecord --> nextNumber = " + nextNumber);					
	
	activity["createTime"] = new Date();
	activity["recordId"] = id;
	activity["createdBy"] = (operator != null?operator:system.functions.operator());
	activity["updateType"] = type;
	activity["id"] = nextNumber;
	activity["description"] = (text instanceof Array?text:[text]);
	activity["visibleToEnduser"] = custvisible;
	
	var rc = activity.doInsert();

	if (RC_SUCCESS != rc ){
		log.warning(level, "Activity could not be inserted");
	}
	
	log.debug(level, "expActivityUpdates::addActivityRecord --> END");		
}

/* Description:
 *   This function returns the corresponding activity filename when passed a regular filename
 * Date created: 20100203
 * Author: Michael Kristensen (mbk@globicon.dk)
 * Comments:
 * Version: 1.00
 * Change History:
 *   1.00: EXPIM100104-MK-20100203, mbk@globicon.dk: added
 * Type: Public
 * Arguments:
 *   String:filename, the filename that you request the activity filename for (i.e. incidents, probsummary, expWorkorder, etc.)
 * Returns:
 *   String, the filename of the activity file (i.e. activityservicemgmt, etc.)
 * Throws:
 *   n/a
 */
function returnActivityFilename(filename) {
	log.debug(level, "expActivityUpdates::returnActivityFilename --> START");	
	log.debug(level, "expActivityUpdates::returnActivityFilename --> filename = "+filename);		

	var strActivityFilename;

	switch (filename){
		case ("ismIncident"):
			strActivityFilename = "ismIncidentActivity";
			break;
		case ("ismInteraction"):
			strActivityFilename = "ismInteractionActivity";
			break;
		case ("ismProblem"):
			strActivityFilename = "ismProblemActivity";
			break;
		case ("ismChange"):
			strActivityFilename = "ismChangeActivity";
			break;
		case ("ismTask"):
			strActivityFilename = "ismTaskActivity";
			break;
		case ("ismUser"):
			strActivityFilename = "ismUserActivity";
			break;
			
	}
	
	log.debug(level, "expActivityUpdates::returnActivityFilename --> END");	
	return strActivityFilename;

}