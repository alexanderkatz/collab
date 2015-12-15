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
            // refresh page
            location.reload();
        }
    });
}

// Search Skill
function searchBySkill(skillName){
	$.ajax({
        url: '/search',
        type: 'POST',
        data: {"search": skillName},
        error: function(result){
            console.log("error: "+result);
        },
        success: function(result){
            console.log("success with: " + result);

        }
    });
}
