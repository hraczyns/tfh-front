export const addLinkToRef = (response, filename, ref) => {
    response.blob()
        .then(blob => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = filename;
            ref.current = a;
        });
}