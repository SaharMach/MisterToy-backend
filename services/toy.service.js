import fs from 'fs'
import { utilService } from './util.service.js'

const toys = utilService.readJsonFile('data/toy.json')
const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle', 'Outdoor', 'Battery Powered']
const imgs = ["https://lumiere-a.akamaihd.net/v1/images/open-uri20150422-20810-a07syh_9331bd0a.jpeg?region=0,0,450,450",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0FPkmwZetj0GC8CsmkFwjhSX_1HeAcudjuw&usqp=CAU", 
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4tvVBYdCfyiAcTR0W7AyN1wa6LFQQwi9UzhjKwnZFz_ZkX3T0PpZ4-B10C2UrkohaM3Q&usqp=CAU",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWAMjWtLKM38J9fNyp73awZecPMSgnenTj_7K2gUxq7AtgGbh6QUYpFZWyAdhyM6ryKgY&usqp=CAU",
]
export const toyService = {
    query,
    get,
    remove,
    save,
    getEmptyToy
}



function query(filterBy = {}) {
    let toysToShow = toys
    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        toysToShow = toysToShow.filter(toy => regExp.test(toy.name))
    } 
    if (filterBy.inStock) {
        const regExp = new RegExp(filterBy.inStock, 'i')
        toysToShow = toysToShow.filter(toy =>  regExp.test(toy.inStock))
    }
    if (filterBy.labels) {
        const regExp = new RegExp(filterBy.labels, 'i')
        toysToShow= toysToShow.filter(toy => regExp.test(toy.labels))
    }
    if (filterBy.sortBy) {
        toysToShow.sort((a, b) => {
            switch (filterBy.sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name)
                case 'price':
                    return a.price - b.price
                case 'created':
                    return new Date(a.created) - new Date(b.created)
                default:
                return 
            }
        })
    }   
    return Promise.resolve({toysToShow, labels})
}

function get(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    if (!toy) return Promise.reject('toy not found!')
    return Promise.resolve(toy)
}

function remove(toyId) {
    console.log('toyId:', toyId)
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No Such toy')
    // const toy = toys[idx]
    toys.splice(idx, 1)
    return _saveToysToFile()
}

function save(toy) {
    if (toy._id) {
        const toyToUpdate = toys.find(currToy => currToy._id === toy._id)
        toyToUpdate.name = toy.name
        toyToUpdate.price = toy.price
    } else {
        toy._id = _makeId()
        toys.push(toy)
    }

    return _saveToysToFile().then(() => toy)
}

function _makeId(length = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        const toysStr = JSON.stringify(toys, null, 4)
        fs.writeFile('data/toy.json', toysStr, (err) => {
            if (err) {
                return console.log(err);
            }
            console.log('The file was saved!');
            resolve()
        })
    })
}

function getEmptyToy(name, price ) {
    let label = utilService.getRandomIntInclusive(0, labels.length)
    let img = utilService.getRandomIntInclusive(0, imgs.length)
    return {
        name,
        price,
        labels: [labels[label]],
        inStock: true,
        createdAt: Date.now(),
        img: imgs[img]
        }
}

