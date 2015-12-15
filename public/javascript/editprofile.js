// Remove Skill
function removeSkill(skillName){
	$.ajax({
        url: '/removeSkill',
        type: 'POST',
        data: {"skillName": skillName},
        error: function(result){
            console.log("error: "+result);
        },
        success: function(result){
            console.log("success with: " + result);
            // refresh blogroll
            location.reload();
        }
    });
}
