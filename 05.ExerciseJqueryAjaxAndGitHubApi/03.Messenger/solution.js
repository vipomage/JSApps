function attachEvents() {
    $.ajax({
        url: 'https://messenger-b9382.firebaseio.com/.json',
        success: populateData
    });
    function populateData(response) {

        let ordered = [];
        for (let message in response) {
            ordered[response[message]['timestamp']] = `${response[message]['author']}: ${response[message]['content']}`;
        }
        ordered.sort((a, b) => a - b);
        for (let obj in ordered) {
            $('textarea#messages').append(`${ordered[obj]}\n`)
        }
    }
    $('input#submit').on('click', () => {
        let obj = {
            author: $('input#author').val(),
            content: $('input#content').val(),
            timestamp: Date.now()
        };
        $.ajax({
            method: 'POST',
            url: 'https://messenger-b9382.firebaseio.com/.json',
            data: JSON.stringify(obj)
        });
        $(`input#author`).val('');
        $(`input#content`).val('');
    });
    $('input#refresh').on('click', () => {
        $('#messages').empty();
        $.ajax({
            url: 'https://messenger-b9382.firebaseio.com/.json',
            success: populateData
        });
    })
}