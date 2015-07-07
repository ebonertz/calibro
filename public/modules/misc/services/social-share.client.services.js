'use strict';

angular.module('misc').service('SocialShareService', ['$location',
    function($location) {
        var twitterBase = "https://twitter.com/intent/tweet?";

        this.twitterLink = function(text){
            var queryArray = {
                "original_referer": $location.absUrl(),
                "text": text,
                "tw_p": "tweetbutton",
                "url": $location.absUrl(),
                "via": "Focali"
            };

            // https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Flocal.focali.com%3A3000%2F&text=Testing%20Twitter%20Share&tw_p=tweetbutton&url=%27&via=Focali
            var query = "";
            for (var key in queryArray) {
                query += key;
                query += "=";
                query += encodeURIComponent(queryArray[key]);
                query += "&";
            }

            return twitterBase + query.slice(0,-1)
        }

        this.shareLink = function(){
            var url = '//'+$location.host()
            if($location)
            return "http://uskk7d36f0e2.sikian.koding.io:3000/#!"+$location.path();
            //return $location.absUrl();
        }
    }
]);
