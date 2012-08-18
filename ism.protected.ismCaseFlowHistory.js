/* 
 * Description:
 * Date Created: 18/06/12 12:39:13
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
var audit_version = "AUDIT_ismCaseFlowHistory1345301371595";
var expresso_version = "eXpresso version 3.4.5 for the application 9.30.000";
var log = new system.library.expObjects.Log();
var level = log.LOG_LEVEL_INFO;

var CONST = new system.library.expConstants.Constants();
function getVersion() {return expresso_version + ", " + audit_version;}

/* 
 * Description:
 * Date Created: 11/02/22 21:09:02
 * Author: Petar Kadijevic (pk)
 * Comments: 
 * Version: 1
 * Change History: 
 * Arguments: 
 * Returns: 
 * Throws: 
 * Example: 
 * Type: 
 */
var audit_version = "AUDIT_expCaseFlowHistory1317201361735";
var expresso_version = "eXpresso version 3.4.0 for the application 9.30.000";
var log = new system.library.expObjects.Log();
var level = log.LOG_LEVEL_INFO;

var CONST = new system.library.expConstants.Constants();
function getVersion() {return expresso_version + ", " + audit_version;}

function fetchHistoryfromRelatedRecord(fh){

	var moduleTable = system.functions.filename(fh);
	switch(moduleTable) {
	case "ismIncident":
		syncAttachmentsToIM(fh);
		vars["$expIMattachmentInfo"] = buildAttachmentInfoTable(fh["id"]);
	  	vars["$exp.im.htmlcfhist"] = buildCaseFlowHistoryTable(fh);
		
	  break;
	case "ismInteraction":
		syncAttachmentsToIA(fh);
		vars["$expIAattachmentInfo"] = buildAttachmentInfoTable(fh["id"]);
	  	vars["$exp.ia.htmlcfhist"] = buildCaseFlowHistoryTable(fh);
	  	
	  break;
	case "ismWorkorder":
		syncAttachmentsToWO(fh);
		vars["$expWOattachmentInfo"] = buildAttachmentInfoTable(fh["id"]);
	  	vars["$exp.wo.htmlcfhist"] = buildCaseFlowHistoryTable(fh);
	  	
	  break;
	case "ismProblem":
		syncAttachmentsToPM(fh);
		vars["$expPMattachmentInfo"] = buildAttachmentInfoTable(fh["id"]);
	  	vars["$exp.pm.htmlcfhist"] = buildCaseFlowHistoryTable(fh);
	  	
	  break;
	case "ismChange":
		syncAttachmentsToCH(fh);
		vars["$expCMattachmentInfo"] = buildAttachmentInfoTable(fh["id"]);
	  	vars["$exp.cm.htmlcfhist"] = buildCaseFlowHistoryTable(fh);
	  	
	  break;
	case "ismTask":
		syncAttachmentsToCHT(fh);
		vars["$expCTattachmentInfo"] = buildAttachmentInfoTable(fh["id"]);
	  	vars["$exp.ct.htmlcfhist"] = buildCaseFlowHistoryTable(fh);
	  break;
	}

}

//hz-20110817: new funciton to show caseflowhistory used direclty from the caseflowhistory html viewer in all modules
function buildCaseFlowHistoryTableForForms(id) {
	var moduleTable =  lib.expfunctions.getFilenameFromPrefix(id);
	//var moduleId = lib.expfunctions.returnID(moduleTable);
	
	if (moduleTable == null) { // we need to do this if someones clicks the refresh or enters the caseflow tab and ID is not filled.
		return buildCaseFlowHistoryTable(fh);
	}

	var moduleId = "id";
	var fh = new SCFile(moduleTable);
	var q = moduleId + "=\"" + id + "\"";

	if (RC_SUCCESS == fh.doSelect(q)) {


		return buildCaseFlowHistoryTable(fh);
	}
	
	return buildCaseFlowHistoryTable(fh);
}

function buildCaseFlowHistoryTable(fh){

	if ( system.functions.filename(fh) == "ismIncident") {
		var related = lib.ismCaseFlowHistoryHelper.getRelatedTotalByIM( fh["id"] );

	}
	
	if ( system.functions.filename(fh) == "ismInteraction") {
		var related = lib.ismCaseFlowHistoryHelper.getRelatedTotalByIA( fh["id"] );
	}
	
	if ( system.functions.filename(fh) == "ismWorkorder") {
		var related = lib.ismCaseFlowHistoryHelper.getRelatedTotalByWO( fh["id"] );
	}
	
	if ( system.functions.filename(fh) == "ismProblem") {
		var related = lib.ismCaseFlowHistoryHelper.getRelatedTotalByPM( fh["id"] );
	}
	
	if ( system.functions.filename(fh) == "ismChange") {
		var related = lib.ismCaseFlowHistoryHelper.getRelatedTotalByCH( fh["id"] );
	}

	if ( system.functions.filename(fh) == "ismTask") {
		var related = lib.ismCaseFlowHistoryHelper.getRelatedTotalByCHT( fh["id"] );
	}
	
	if ( related == null ) {
		related = new Array();
	}
	var activityQueryObjects = new Array();
	for (var i = 0 ; i < related.length ; i++ ){
		// build activityQueryObjects
		if ( related[i]["module"] == "ismIncident") {
			var activityTable = "ismIncidentActivity";
		}
		if ( related[i]["module"] == "ismInteraction") {
			var activityTable = "ismInteractionActivity";
		}
		if ( related[i]["module"] == "ismProblem") {
			var activityTable = "ismProblemActivity";
		}
		if ( related[i]["module"] == "ismChange") {
			var activityTable = "ismChangeActivity";
		}
		if ( related[i]["module"] == "ismTask") {
			var activityTable = "ismTaskActivity";
		}
		// Activity update on CH TASK not implemented
		/*
		if ( related[i]["module"] == "cm3t") {
			var activityTable = "activityXXX";
		}
		*/
		if ( related[i]["module"] == "ismWorkorder") {
			var activityTable = "ismWorkorderActivity";
		}

		
		if ( activityTable != null && activityTable != "" ){
			var id = related[i]["id"];

			var q = system.library.ismHtmlHistory.buildQuery(id, "cf");
			//print(q);
			var origin = id; 
			
			// 20120619-pk
			if ( String(system.vars["$G.exp.cffilter.rcdOnly"]) == "true") {
				if ( origin !== fh["id"]) {
					continue;
				}
			}
			var activityQueryObject = [activityTable, q, origin];
			activityQueryObjects.push(activityQueryObject);
			
		}
	}	

	return system.library.ismHtmlHistory.getTotalHistory( activityQueryObjects, 300, fh)[0];

}

//hz-20110817: new function to copy and show attachments used direclty from the attachmnet html viewer in all modules
// 20110822-pk-Display of related record's attachment didn't show until after the second time you enter the related record
// Therefor instead we call it from post triggers expHtrg*
function syncAttachmentsToRecord(id) {
	var related = "";
	var	moduleTable =  lib.expfunctions.getFilenameFromPrefix(id);
	switch(moduleTable) {
	case "ismIncident":
		related = lib.ismCaseFlowHistoryHelper.getRelatedTotalByIM(id);
	  	break;
	case "ismInteraction":
		related = lib.ismCaseFlowHistoryHelper.getRelatedTotalByIA(id);
	  	break;
	case "ismWorkorder":
		related = lib.ismCaseFlowHistoryHelper.getRelatedTotalByWO(id);
	  	break;
	case "ismProblem":
		related = lib.ismCaseFlowHistoryHelper.getRelatedTotalByPM(id);
	  	break;
	case "ismChange":
		related = lib.ismCaseFlowHistoryHelper.getRelatedTotalByCH(id);
	  	break;
	case "ismTask":
		related = lib.ismCaseFlowHistoryHelper.getRelatedTotalByCHT(id);
		break;
	}
//	copyAttachments(related, moduleTable, id);  // 20110822-pk - see comment above
	return buildAttachmentInfoTable(id);
}

function syncAttachmentsToIM(imFh){

	var related = lib.ismCaseFlowHistoryHelper.getRelatedTotalByIM(imFh["id"]);
	copyAttachments(related, "ismIncident", imFh["id"]);
}

function syncAttachmentsToIA(iaFh){

	var related = lib.ismCaseFlowHistoryHelper.getRelatedTotalByIA(iaFh["id"]);
	copyAttachments(related, "ismInteraction", iaFh["id"]);
}

function syncAttachmentsToWO(woFh){

	var related = lib.ismCaseFlowHistoryHelper.getRelatedTotalByWO(woFh["id"]);
	copyAttachments(related, "ismWorkorder", woFh["id"]);
}

function syncAttachmentsToPM(pmFh){

	var related = lib.ismCaseFlowHistoryHelper.getRelatedTotalByPM(pmFh["id"]);
	copyAttachments(related, "ismProblem", pmFh["id"]);
}

function syncAttachmentsToCH(cmFh){

	var related = lib.ismCaseFlowHistoryHelper.getRelatedTotalByCH(cmFh["id"]);
	copyAttachments(related, "ismChange", cmFh["id"]);
}

function syncAttachmentsToCHT(ctFh){

	var related = lib.ismCaseFlowHistoryHelper.getRelatedTotalByCHT(ctFh["id"]);
	copyAttachments(related, "ismTask", ctFh["id"]);
}

function pushAttachments(related, fromTable, fromId){
	for ( var i = 0 ; i < related.length ; i++ ){
		var toTable = (related[i]["module"] == "ismIncident" ) ? "ismIncident" : related[i]["module"];
		var toId = related[i]["id"];
//		var toTable = "probsummary";
//		var toId = imFh["number"];

/*
		print("fromTable" + fromTable);
		print("fromId" + fromId);
		print("toTable" + toTable);
		print("toId" + toId);
*/
		copyAttachmentCaseFlowVersion(fromTable, fromId, toTable, toId, related);	
	}

}

function copyAttachments(related, toTable, toId){

	for ( var i = 0 ; i < related.length ; i++ ){
		var fromTable = (related[i]["module"] == "ismIncident" ) ? "ismIncident" : related[i]["module"];
		var fromId = related[i]["id"];
//		var toTable = "probsummary";
//		var toId = imFh["number"];
/*
		print("fromTable" + fromTable);
		print("fromId" + fromId);
		print("toTable" + toTable);
		print("toId" + toId);
*/
		copyAttachmentCaseFlowVersion(fromTable, fromId, toTable, toId, related);	
	}

}

	
	
function copyAttachmentCaseFlowVersion(fromTable, fromId, toTable, toId, related){
 	system.library.expObjectExtensions.include();
/*
	print("copyAttachment");
	print("  fromTable:" + fromTable);
	print("  fromId:" + fromId);
	print("  toTable:" + toTable);
	print("  toId:" + toId);
	print("  related:" + related);				
*/
				
	if (fromTable == "" || fromTable == null) {
		log.warning(level, "copyAttachment called with no fromTable");
		return;
	}

	if (fromId == "" || fromId == null) {
		log.warning(level, "copyAttachment called with no fromId");
		return;
	}

	if (toTable == "" || toTable == null) {
		log.warning(level, "copyAttachment called with no toTable");
		return;
	}

	if (toId == "" || toId == null) {
		log.warning(level, "copyAttachment called with no toId");
		return;
	}

	if (toId == fromId && toTable == fromTable) {
		return;
	}

	// debug
//	print("Copying Attachments from " + fromId + " to " + toId);

/*
	var blob = new SCFile("SYSATTACHMENTS", SCFILE_READONLY);
	var fields = new Array("uid","segment","filename","application","topic");
	var rc = blob.setFields(fields);
*/
// PK-20110709 ABOVE OUTCOMMENTED since it was wrong to use a READ ONLY fh on an fh where we later do a doInsert()
	var blob = new SCFile("SYSATTACHMENTS");
	
	
	var q1 = 'application="' + fromTable +'" and topic="' + fromId + '"';
//	print("q1:" + q1);

	if (RC_SUCCESS == blob.doSelect(q1)){ // Attachment found
		var uidsAllreadyCopied = new Array();
		do {

			// 20110816-pk improving performance
			if ( uidsAllreadyCopied.contains(blob["uid"]) ) {
				// no need to do a doSelect (hits performance), just ignore
				continue;
			}

		//	print("Copying " + blob["filename"] + " segment=" + blob["segment"]);
			// First check if attachment with the same uid name is allready in the target record.
			// It could be allready copied or at least you do not want to overwrite the existing attachment
			var blobCheck = new SCFile("SYSATTACHMENTS", SCFILE_READONLY);
 			var fields = new Array("uid"); 
			var rc = blobCheck.setFields(fields);
//			var blobCheck = new SCFile("SYSATTACHMENTS");  // 20110816-pk removed (we define above as read only, guess it was an mistake to redefine it
	//		if (RC_SUCCESS != blobCheck.doSelect('application="' + toTable +'" and topic="' + toId + '" and filename="' + blob["filename"] +'"' )){
			var q2 = 'application="' + toTable +'" and topic="' + toId + '" and segment=' + blob["segment"] + ' and uid="' + blob["uid"] +'"' ;
		//	print("q2" + q2);
			if (RC_SUCCESS == blobCheck.doSelect(q2)){	 // corrected by expDEV (3.2.0.35) - enhancement of intermodule history and attachment
				// No Operation
				log.debug(level, "Attachment not copied since its allready there - ignore copy of " + blob["filename"]); // debug
				// print("Attachment not copied since its allready there - ignore copy of " + blob["filename"]);
				uidsAllreadyCopied.push(blob["uid"]);
				continue;				
			}

			
			var orgSource = attachmentOriginsFrom(blob["uid"]);

			// hz-20110907: if the source is an expmail then need to set orgSource here otherwise it doesn't copy over the attachments from expmail 
			// to related records of the IA so need to set the orgSource according to the related ia id of the expmail record
			if ( String(orgSource).indexOf("expmail") > -1 ) {

				// 20110926-hz-SCFileREAD_ONLY
				var fhExpmail = new SCFile("expmail", SCFILE_READONLY);
				var fields = new Array("number", "target", "exp.target.file");
				var rc = fhExpmail.setFields(fields);

				var start = 0;
				var end = String(orgSource).indexOf(":");
				var mailId = String(orgSource).substring(start, end);
				var queryMail = "number=\"" + mailId + "\"";
				if ( RC_SUCCESS == fhExpmail.doSelect( queryMail ) ) {
					orgSource = new lib.expCaseFlowHistoryHelper.relatedID( fhExpmail["target"], fhExpmail["exp.target.file"] );
				}
			} // hz-20110907: end of new code

			if ( ! isOrgSourceInRelated(related, orgSource) ){
				//print("Not within parential level - ignore attachment copy of " + blob["filename"]);
				continue;
			}

			// Copy attachment
			blob["application"] = toTable;
			blob["topic"] = toId;
			if (RC_SUCCESS != blob.doInsert()){
				log.error(level, "An error occured copying attachment from " + fromId + " to " + toId);
			} else {
				// debug
				// print("Attachment segment added for " + blob["filename"] + " segment=" + blob["segment"]);
			}
		} while ( blob.getNext() == RC_SUCCESS )
	}
}

function isOrgSourceInRelated(related, orgSource){

//	print("isOrgSourceInRelated runs");
//	print("isOrgSourceInRelated >> related: " + related);
//	print("isOrgSourceInRelated >> orgSource: " + orgSource);

	for (var i = 0 ; i < related.length ; i++ ){
		if ( related[i]["id"] == orgSource["id"] && related[i]["module"] == orgSource["module"] ){
			// return false;  Noted by PK-20110709 that someone had changed this from true to false, but there was no explanation
			//                Now reverted back so the whole thing works again
			return true;
		}
	}
	return false;	
//	return true;  Noted by PK-20110709 that someone had changed this from true to false, but there was no explanation
//                Now reverted back so the whole thing works again
}


// returns the relatedID of the record where the attachment was originally added
function attachmentOriginsFrom(uid){

	// 20110816-pk improving performance
	var metaData = new SCFile("expSYSATTACHmetadata", SCFILE_READONLY);
	var fields = new Array("application", "source"); 
	var rc = metaData.setFields(fields);
//	var metaData = new SCFile("expSYSATTACHmetadata");

	//var q = 'uid="' + blobFh["uid"] + '"';
 	// 20110816-pk improving performance ... add'ed segment=0 .. afterall we only need get the data from where it origins
	// 20110816-pk added key in table expSYSATTACHmetadata
//	var q = 'application="' + blobFh["application"] + '" and topic="' + blobFh["topic"] + '" and type="' + blobFh["type"] + '" and segment="' + blobFh["segment"] + '" and uid="' + blobFh["uid"] + '"';
	var q = 'segment=' + 0 + ' and uid="' + uid + '"';


// return new lib.expCaseFlowHistoryHelper.relatedID( "N", "NA" );

	if ( RC_SUCCESS == metaData.doSelect(q) ){
		var orgSourceModule = ( metaData["application"] == "ismIncident") ? "ismIncident" : metaData["application"];
		return new lib.expCaseFlowHistoryHelper.relatedID( metaData["source"], orgSourceModule );
	}
	// We should never be here!!!
	// 20110816-pk 		UNLESS there were attachemnts added before introducing caseflow history (so for existing customers that are in PROD and gets this 'module')
	
	log.debug(level, "Could not find the origin of attachment " + uid + ". Please contact System Administrator");
	return new lib.expCaseFlowHistoryHelper.relatedID( "N/A", "N/A" );
}

function buildAttachmentInfoTable(rcdId){

	var table = new lib.expHtmltable.HtmlTable();
	var h = ["File Name","Size (MB)", "Source Record", "Added By", "Added At"];
	table.setHeader(h);
	var rowData = new Array() ; // array of arrays
	
	var files = new SCFile("SYSATTACHMENTS");
	var selRC = new SCDatum();
	var sortFields = ["sysmodtime"];
	var p4q = 'topic="' + rcdId + '"';
	
	var rc = system.functions.rtecall("select", selRC, files, p4q , sortFields, true) ;   // TODO: HANDLE SORTING WITH NEW JAVASCRIPT FEATURE

	do {
	
		// check if select did not return anything
		if ( files["topic"] == null ) {
			break;
		}
		// Controlling the fact the ONE (large) file is split into multiple SYSATTACHMENT rcds
		if ( Number(files["segment"]) > 0 ){
			continue;	
		}
		
		var rowArrayElement = new Array();
		rowArrayElement[0] = files["filename"];
		var humanSize = Number(files["size"])/1024/1024;
		humanSize = humanSize.toFixed(1);
		if ( Number(humanSize) < 0.1){
			humanSize = humanSize + " (bytes: " + files["size"] + ")";
		}
		rowArrayElement[1] = humanSize;
		
		// Lookup in "expSYSATTACHmetadata
		// 20110926-hz-SCFileREAD_ONLY
		var sa = new SCFile("expSYSATTACHmetadata", SCFILE_READONLY);
		var fields = new Array("segment", "type", "uid", "source", "added.by", "added.at");
		var rc = sa.setFields(fields);

		var q = '';
		q +=  'segment="' + files["segment"] + '" and ';
		q +=  'type="' + files["type"] + '" and ';
		q +=  'uid="' + files["uid"] + '"';
//		q +=  'application="' + files["application"] + '"';
		var rc = sa.doSelect(q);
		if (rc == RC_SUCCESS ) {
			rowArrayElement[2] = sa["source"];
			rowArrayElement[3] = sa["added.by"];
			rowArrayElement[4] = sa["added.at"];
		}
		rowData.push(rowArrayElement);
	} while (files.getNext() == RC_SUCCESS );
	
	table.setData(rowData);
	return table.getHtml();
}

