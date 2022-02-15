const priceServiceParams = {
    getParamsByContent: (content) =>{
        return content
            .map(frag => {
                return {
                    startId: frag.additionalData.localStartStopTimeId,
                    stopId: frag.additionalData.localEndStopTimeId
                }
            }).reduce((prev, curr, index) => {
                if (index === 0) {
                    prev += curr.startId + ',' + curr.stopId;
                } else {
                    prev += ',' + curr.startId + ',' + curr.stopId;
                }
                return prev;
            }, '');
    }
}

export default priceServiceParams;