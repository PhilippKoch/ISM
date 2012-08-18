/* 
 * Description:
 * Date Created: 20/06/2012 09:56:38
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
var audit_version = "AUDIT_ismChange1345301380424";
var expresso_version = "eXpresso version 3.4.5 for the application 9.30.000";
var log = new system.library.expObjects.Log();
var level = log.LOG_LEVEL_INFO;

var CONST = new system.library.expConstants.Constants();
function getVersion() {return expresso_version + ", " + audit_version;}


var STATUSCODES = new lib.ismStatus.Constants();	

function submitChange(fh) {
	log.debug(level, "ismChange::submitChange --> START");
	
	var rc = 0;
	var now = new Date();
	var modFh = new SCDatum();
	system.functions.fduplicate(modFh, fh);
	
	fh["openedBy"] = system.functions.operator().toUpperCase();
	fh["openTime"] = now;	
	

	// RUN VALIDATION
	var msg = lib.expValidations.validateIMrcd(fh, modFh, true, "ismChange_add");
	
	if (msg=="") {	
		
		// SAVE THE RECORD
		preSave(fh);	
		save(fh);
		postSave(fh);
		
		print("Change " + fh["id"] + " created");
		
		lib.ismActivityUpdates.addActivityRecord("ismChange", fh["id"], "Create", "Change created", system.functions.operator().toUpperCase(), false)		
		
	} else {
		rc = -1;
	}

	log.debug(level, "ismChange::submitChange --> END rc(" + rc + ")");	
	return rc;
}

function sendToApproval(fh) {
	fh["phase"] = STATUSCODES.CHANGE_PHASE_APPROVAL ;
	return updateChange(fh);
}

function sendToImplementation(fh) {
	fh["phase"] = STATUSCODES.CHANGE_PHASE_IMPLEMENTATION ;
	return updateChange(fh);
}

function sendToPIR(fh) {
	fh["phase"] = STATUSCODES.CHANGE_PHASE_PIR ;
	return updateChange(fh);
}

function approveChange(fh) {
	fh["phase"] = STATUSCODES.CHANGE_PHASE_IMPLEMENTATION;
	return updateChange(fh);
}

function denyChange(fh) {
	fh["phase"] = STATUSCODES.CHANGE_PHASE_REGISTRATION;

	resetTasks(fh);
	
	return updateChange(fh);
}

function cancelChange(fh) {
	fh["phase"] = STATUSCODES.CHANGE_PHASE_PIR;
	return updateChange(fh);
}


function updateChange(fh) {
//	var level = log.LOG_LEVEL_DEBUG;
	log.debug(level, "ismChange::updateChange --> START");
	
	var rc = 0;
	var now = new Date();
	var modFh = new SCDatum();
	system.functions.fduplicate(modFh, fh);
	

	// RUN VALIDATION
	var msg = lib.expValidations.validateIMrcd(fh, modFh, true, "ismChange_update");
	
	if (msg=="") {
	
		fh["updatedBy"] = system.functions.operator().toUpperCase();
		fh["updateTime"] = now;
	
		// Check which fields that are updated
		var existingRecord = getExistingRecord(fh);
	
		
		// SAVE THE RECORD
		preSave(fh);			
		save(fh);
		postSave(fh);
		
		print("Change " + fh["id"] + " updated");

		// Activity Updated
		if (lib.expfunctions.toJSArray(fh["tempUpdate"]).length>0) {
			lib.ismActivityUpdates.addActivityRecord("ismChange", fh["id"], "Operator Update", fh["tempUpdate"], system.functions.operator().toUpperCase(), false);
		}				
		
		if (fh["status"] != existingRecord["status"]) {
			lib.ismActivityUpdates.addActivityRecord("ismChange", fh["id"], "Status Update", "Status changed from " + existingRecord["status"] + " to " + fh["status"],  system.functions.operator().toUpperCase(), false);		
		}

		if (fh["assignmentGroup"] != existingRecord["assignmentGroup"]) {
			lib.ismActivityUpdates.addActivityRecord("ismChange", fh["id"], "Reassignment", "Assignment changed from " + existingRecord["assignmentGroup"] + " to " + fh["assignmentGroup"],  system.functions.operator().toUpperCase(), false);		
		}
		
		if (fh["priority"] != existingRecord["priority"]) {
			lib.ismActivityUpdates.addActivityRecord("ismChange", fh["id"], "Priority Update", "Risk changed from " + existingRecord["risk"] + " to " + fh["risk"],  system.functions.operator().toUpperCase(), false);		
		}

		if (fh["phase"] != existingRecord["phase"]) {
			lib.ismActivityUpdates.addActivityRecord("ismChange", fh["id"], "Phase Change", "Phase changed from " + existingRecord["phase"] + " to " + fh["phase"],  system.functions.operator().toUpperCase(), false);		
		}
				
		
		clearUpdateField(fh);
		
	} else {
		rc = -1;
	}
	
	log.debug(level, "ismChange::updateChange --> END rc(" + rc + ")");		
	return rc;

}


function closeChange(fh) {
//	var level = log.LOG_LEVEL_DEBUG;
	log.debug(level, "ismChange::closeChange --> START");
	
	var now = new Date();
	var modFh = new SCDatum();
	system.functions.fduplicate(modFh, fh);
	

	// RUN VALIDATION
	var msg = lib.expValidations.validateIMrcd(fh, modFh, true, "ismChange_update");
	
	if (msg=="") {
	
		fh["closedBy"] = system.functions.operator().toUpperCase();
		fh["closeTime"] = now;
		fh["status"] = 	"Closed";
	
		
		// SAVE THE RECORD
		preSave(fh);	
		save(fh);
		postSave(fh);
		
		print("Change " + fh["id"] + " closed");
		lib.ismActivityUpdates.addActivityRecord("ismChange", fh["id"], "Close", "Change closed", system.functions.operator().toUpperCase(), false)		
		
		lib.ismChangeDS.setROFields(fh);		
		
	}
	
	
	log.debug(level, "ismChange::closeChange --> END");
}

function reopenIncident(fh) {
//	var level = log.LOG_LEVEL_DEBUG;
	log.debug(level, "ismChange::updateIncident --> START");
	
	var now = new Date();
	var modFh = new SCDatum();
	system.functions.fduplicate(modFh, fh);
	

	// RUN VALIDATION
	var msg = lib.expValidations.validateIMrcd(fh, modFh, true, "ismChange_update");
	
	if (msg=="") {
	
		fh["closedBy"] = null;
		fh["closeTime"] = null;
		fh["status"] = 	"Assigned";
		
		fh["reopenTime"] = new Date();
		fh["reopendBy"] = system.functions.operator().toUpperCase();
	
		
		// SAVE THE RECORD
		preSave(fh);	
		save(fh);
		postSave(fh);
		
		print("Incident " + fh["id"] + " reopened");
		lib.ismActivityUpdates.addActivityRecord("ismChange", fh["id"], "Reopen", "Incident reopened", system.functions.operator().toUpperCase(), false)		
		

		
		lib.ismChangeDS.setROFields(fh);		
		
	}
	
	
	log.debug(level, "ismChange::updateIncident --> END");
}



function preSave(fh)  {
	// Add the id
	if (fh["id"]==null) {
		fh["id"] = lib.expfunctions.getNumber("ismChange");
	}
	
	
	
}

function save(fh)  {
	var rc = -1
	
	

	if (vars["$ism.mode"] === "add") {
	
//		print("Calling do Insert for ID" + fh["id"]);
		rc = fh.doInsert();
	} else {
//		print("Calling do Update");	
		rc = fh.doUpdate();
	}
	return rc;
}

function postSave(fh) {
		
	var modFh = new SCDatum();
	system.functions.fduplicate(modFh, fh);
	vars["$L.saved.filed"] = modFh;
	
	
	// if ch created  from im
	if ( vars["$G.ismIM2CMrelatedIMid"] !== null && vars["$G.ismIM2CMrelatedIMid"] !== "" ) {
		var ismRel = new SCFile("ismRelation");
		ismRel["sourceId"] = fh["id"];
		ismRel["sourceTable"] = "ismChange";
		ismRel["targetId"] = vars["$G.ismIM2CMrelatedIMid"];
		ismRel["targetTable"] = "ismIncident";
		ismRel.doSave();
		lib.ismActivityUpdates.addActivityRecord("ismChange", fh["id"], "Relationship", "Change created from "+ vars["$G.ismIM2CMrelatedIMid"], system.functions.operator().toUpperCase(), false);	
	}
	vars["$G.ismIM2CMrelatedIMid"] = "";
	
	// if ch created from pm
	if ( vars["$G.ismPM2CMrelatedPMid"] !== null && vars["$G.ismPM2CMrelatedPMid"] !== "" ) {
		var ismRel = new SCFile("ismRelation");
		ismRel["sourceId"] = fh["id"];
		ismRel["sourceTable"] = "ismChange";
		ismRel["targetId"] = vars["$G.ismPM2CMrelatedPMid"];
		ismRel["targetTable"] = "ismProblem";
		ismRel.doSave();
		lib.ismActivityUpdates.addActivityRecord("ismChange", fh["id"], "Relationship", "Change created from "+ vars["$G.ismPM2CMrelatedPMid"], system.functions.operator().toUpperCase(), false);		
	}
	vars["$G.ismPM2CMrelatedPMid"] = "";



	// Activate Next Taxk
	lib.ismModel.activateNext(fh);
	
}



function perform32099action( fh ) {
	var linktable = system.functions.get_link_table();
	var linkquery = system.functions.get_link_query();
	
	
	if ( linktable === "RELUnlinkACTION" ){
		lib.ismRelations.unlink(linktable, linkquery );
	} else {
		if ( linktable === "RELLinkACTION" ){
			lib.ismRelations.link(linktable, linkquery);
		} else {
			lib.expfunctions.jumpToRecordByHtmlLink();
		}
	}
}

function clearUpdateField(fh) {

	if (lib.expfunctions.toJSArray(fh["tempUpdate"]).length > 0) {
		fh["tempUpdate"] = new Array();
	}
	
}


function getAllowedActions(fh) {
	var actions = new Array();
	var status = fh["status"];
	var phase = fh["phase"];	
	var changeType = fh["changeType"];
	var operator = system.functions.operator();


	switch (phase) {
		case STATUSCODES.CHANGE_PHASE_REGISTRATION:

			if (changeType==STATUSCODES.CHANGE_TYPE_NORMAL) {
				actions.push("Approval");			
			}
			
			if (changeType==STATUSCODES.CHANGE_TYPE_STANDARD) {
				actions.push("Implement");			
			}

			actions.push("Cancel");			

			
		break;
		case STATUSCODES.CHANGE_PHASE_APPROVAL:
			actions.push("Approve");			
			actions.push("Deny");			

		break;
		case STATUSCODES.CHANGE_PHASE_IMPLEMENTATION:
			actions.push("PIR");			
		break;
		case STATUSCODES.CHANGE_PHASE_PIR:
			if (status!=STATUSCODES.CHANGE_STATUS_CLOSED) {
				actions.push("Close");			
			}
		break;
		
		
	
	
	}

	return actions;
}



// PRIVATE
function getExistingRecord(fh) {
	var file = new SCFile("ismChange");
	var query = "id=\"" + fh["id"] + "\"";
	var rc = RC_SUCCESS == file.doSelect(query) 
	return file;

}

function canIapprove(fh) {
	
	var operator = system.functions.operator().toUpperCase();
	
	var operatorsThatCanApprove = lib.ismGrpUsrRel.getUsersByGroupId(fh["assignmentGroup"]);
	
	if (system.functions.index(operator, operatorsThatCanApprove) > 0) {
		return true;
	}		
	
	return false;

}


function hasActiveTasks(fh) {
	var file = new SCFile("ismTask");
	var query = "parent=\"" + fh["id"] + "\" and status=\"Active\"";
	return (RC_SUCCESS == file.doSelect(query));

}


function resetTasks(fh) {
	var file = new SCFile("ismTask");
	var query = "parent=\"" + fh["id"] + "\" and status~=\"Inactive\"";
	
	if (RC_SUCCESS == file.doSelect(query)) {	
		do {
			file["status"] = "Inactive";
			lib.ismTask.updateTask(file);
		} while (RC_SUCCESS == file.getNext());		
	}

}

