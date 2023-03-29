var btn = document.getElementById('btn')
var pass = document.getElementById("pass")
var form = document.getElementById('form')
var warn = document.getElementById("warn")

form.addEventListener('submit', (e) => {
    e.preventDefault()
    $.ajax('/auth', {
        type: "post",
        data: {
            password: pass.value
        }
    }).done(function (response) {
        console.log('response : ', response);
        if (response == 'logged') {
            form.submit()
            $('#form').unbind();
        }
        else {
            pass.style.borderBottom = '2px red solid'
            warn.style.visibility = 'visible'
        }
    })
})


// btn.onclick = function () {
//     $.ajax('/auth', {
//         type: "post",
//         data: {
//             password: pass.value
//         }
//     }).done(function (response) {
//         console.log('response : ', response);
//         if (response == 'logged') {
//             form.submit();
//         }
//         else {
//             pass.style.borderBottom = '2px red solid'
//             warn.style.visibility = 'visible'
//         }
//     })
// }