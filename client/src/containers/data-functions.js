///\desc This file contains functions to operate on user data fetched from reddit

module.exports = {
    // Scans for the most upvotes to most downvotes posts/comments in just one loop O(n)
    getVotesStats: function(results){
        if(results.length == 0){
            return {    upvoted: {title:'N/A',
                                    score:'-',
                                    ups:'-'}, 
                downvoted: {title:'N/A',
                            score:'-',
                            ups:'-'}, 
                avg_karma: 0   }
        }
        var most_upvotes = 0,most_downvotes = 0;
        var most_upvoted_comment = results[0].data
        var most_downvoted_comment = results[0].data
        var upvote_counts = 0;

        results.forEach(element => {
            var currentUpvotes = element.data.ups
            upvote_counts+= currentUpvotes;

            if(currentUpvotes > most_upvotes){
                most_upvotes = currentUpvotes
                most_upvoted_comment = element.data
            }
            
            if(element.data.score < most_downvotes){
              most_downvotes = element.data.score
              most_downvoted_comment = element.data
            }    
        });
        
        return {    upvoted: most_upvoted_comment, 
                    downvoted: most_downvoted_comment,
                    avg_karma: Math.abs(Math.round(upvote_counts/results.length) )   }
    }
}