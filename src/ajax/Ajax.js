function getLatestFiles(success, failure) {

    req = new XMLHttpRequest();

    req.onload = function () {

        let respObj = JSON.parse(this.responseText);

        if (this.status == 200) {

            success(respObj);

        } else {

            failure(respObj.error);
        }


    }

    req.open("GET", "/latestfiles");
    req.send();

}