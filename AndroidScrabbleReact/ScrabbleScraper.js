import axios from 'axios';

async function wordIsValidEnglish(word) {
    const config = {
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    }
    return axios.get('https://scrabblewordfinder.org/dictionary/' + word, config)
    .then((res) => {
        var data = res.data
        if (data.search('<span class="green">') > -1) {
            return true
        } else if (data.search('<span class="red">') > -1){
            return false
        } else {
            throw 'Something unexpected happened with the web scraper.'
        }
    })
}

export default wordIsValidEnglish

// var answer = await isValidWord('elephant')
// console.log(answer)