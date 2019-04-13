var count = 0;

createCanv();
main();

var
    quote,
    imgs,
    loadedImgs,
    drawnImgs;

function main() {
    quote = null;
    imgs = new Array();
    loadedImgs = 0;
    drawnImgs = 0;
    for (var i = 0; i < 4; i++) {
        imgs[i] = new Image();
        imgs[i].crossOrigin = 'anonymous';
    }
    getPctrs();
    processPics();
    getQuote();
    drawQuote();
}

function createCanv() {
    var
        canvas = document.createElement('canvas'),
        body = document.getElementById('body'),
        download = document.createElement('button'),
        next = document.createElement('button'),
        block = document.createElement('div');

    block.style.width = '100%';
    block.style.display = 'flex';
    block.style.flexDirection = 'column';
    block.style.alignItems = 'center';

    canvas.id = 'canvas';
    canvas.width = 600;
    canvas.height = 600;
    canvas.style.outline = '4px black solid';

    download.id = 'download';
    download.style.margin = '20px';
    download.style.padding = '10px';
    download.innerHTML = 'Download';
    download.style.backgroundColor = 'green';
    download.style.color = 'white';
    download.style.fontSize = '16px';
    download.onclick =
        function () {
            var link = document.createElement('a');
            count++;
            link.href = canvas.toDataURL('image/jpg');
            link.download = 'quote' + count + '.jpg';
            link.click();
        };
    next.id = 'next';
    next.innerHTML = 'Next';
    next.style.backgroundColor = 'yellow';
    next.style.fontSize = '16px';
    next.style.padding = '5px';
    next.onclick =
        function () {
            main();
        }
    block.appendChild(canvas);
    block.appendChild(download);
    block.appendChild(next);
    body.appendChild(block);
}

function getPctrs() {
    $.ajax({
        url: "https://api.codetabs.com/v1/proxy",
        data: {
            quest: 'https://api.unsplash.com/photos/random?' +
                'client_id=e25bfbf8a1d462f0f2e05187bf2bc35a53e3b18bfc7430d17d48f5baadea9b5e' + '&' +
                'count=4' + '&' + 'orientation=squarish'
        }
    })
        .done(
            function (data) {
                for (var i = 0; i < 4; i++) {
                    imgs[i].src = data[i].urls.small;
                    imgs[i].onload = function () {
                        loadedImgs++;
                    };
                }
            })
}

function processPics() {
    if (loadedImgs == 4) {
        var
            x = 0,
            y = 0,
            ox = 200 + Math.round(Math.random() * 200),
            oy = 200 + Math.round(Math.random() * 200),
            h = oy;

        for (var i = 0; i < 2; i++) {
            w = ox;
            drawIMG(imgs[i * 2], 0, 0, imgs[i * 2].naturalWidth, imgs[i * 2].naturalHeight, x, y, w, h);
            x = ox;
            w = 600 - w;
            drawIMG(imgs[i * 2 + 1], 0, 0, imgs[i * 2 + 1].naturalWidth, imgs[i * 2 + 1].naturalHeight, x, y, w, h);
            x = 0;
            y = oy;
            h = 600 - h;
        }

        var context = canvas.getContext('2d');

        context.fillStyle = 'rgba(0,0,0,0.4)';
        context.fillRect(0, 0, 600, 600);
    } else {
        setTimeout(processPics, 1);
    }
}

function drawIMG(img, sx, sy, swidth, sheight, x, y, width, height) {
    var ctx = canvas.getContext('2d');

    ctx.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
    drawnImgs++;
}

function getQuote() {
    var http = new XMLHttpRequest;

    http.open('GET', 'https://cors-anywhere.herokuapp.com/' +
        'https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=ru', true);
    http.send();
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(http.responseText);
            quote = JSON.parse(http.responseText)['quoteText'];
        }
    }
}

function cutQuote(context, text, x, y, maxWidth, lineHeight) {
    var
        words = text.split(" "),
        nWords = words.length,
        nRows = Math.floor(context.measureText(text).width / 550),
        line = "";

    y -= nRows * (lineHeight / 2);
    for (var n = 0; n < nWords; n++) {
        var
            aprxLine = line + words[n] + " ",
            aprxWidth = context.measureText(aprxLine).width;

        if (aprxWidth > maxWidth) {
            context.fillText(line, x, y);
            line = words[n] + " ";
            y += lineHeight;
        }
        else {
            line = aprxLine;
        }
    }
    context.fillText(line, x, y);
}

function drawQuote() {
    if (quote != null && drawnImgs == 4) {
        var context = canvas.getContext('2d');

        context.fillStyle = 'azure';
        context.font = '22pt Comic Sans MS';
        context.textAlign = 'center';
        var x = canvas.width / 2,
            y = canvas.height / 2 + 11;

        cutQuote(context, quote, x, y, 550, 35);
    }
    else {
        setTimeout(drawQuote, 1);
    }
}