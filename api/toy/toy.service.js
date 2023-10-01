import fs from 'fs'
import mongodb from 'mongodb'
const { ObjectId } = mongodb
import { utilService } from '../../services/util.service.js'
import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'

import { log } from 'console'

const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle', 'Outdoor', 'Battery Powered']
const imgs = ["https://res-console.cloudinary.com/dpwmxprpp/thumbnails/v1/image/upload/v1696190689/YnV6el9jZWh0cG4=/grid_landscape",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-V_EzNRxAhsJvumlIKm4w-VXEpjqfN_cEFg&usqp=CAU", 
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4tvVBYdCfyiAcTR0W7AyN1wa6LFQQwi9UzhjKwnZFz_ZkX3T0PpZ4-B10C2UrkohaM3Q&usqp=CAU",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBD0se7qm2IxwPGeUuwamEI18mVPz_H8HUww&usqp=CAU",
"https://www.onlinetoys.com.au/wp-content/webp-express/webp-images/uploads/2021/12/toy-story-4-mrs-potato-head.jpg.webp",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxHNwseGLV9mBq9zpj7m5Na2cQsHC_K3xsS-unbaCO-hsWY1lAKH0eb7SWCVkbDmX-fXY&usqp=CAU"
]

export const toyService = {
    query,
    getById,
    remove,
    add,
    update,
    getEmptyToy,
    addToyMsg
}

async function query(filterBy = {}) {
    let toys 
    try {
        let criteria = {}
        if(filterBy.txt){
            const regex = new RegExp(filterBy.txt, 'i')
            criteria.name = { $regex: regex }
        }
        if(filterBy.labels){
            const regex = new RegExp(filterBy.labels, 'i')
            criteria.labels = { $regex: regex }
        }
        
        if (filterBy.inStock !== '') {
            console.log('filterBy.inStock:', filterBy.inStock);
            if (filterBy.inStock === 'true') {
                criteria.inStock = true;
            } else if (filterBy.inStock === 'false') {
                criteria.inStock = false;
            }
        }
        if(filterBy.sortBy){
            const sort = filterBy.sortBy
            console.log('sort:', sort)
            let key = {}
            key[sort] = 1
            let collection = await dbService.getCollection('toy') 
            toys = await collection.find(criteria).sort(key).toArray()
        } else {
            let collection = await dbService.getCollection('toy') 
            toys = await collection.find(criteria).toArray()
        }
        
        return toys;
    } catch (err) {
        logger.error('cannot find toys', err);
        throw err;
    }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = collection.findOne({ _id: ObjectId(toyId) })
        return toy
    } catch (err) {
        logger.error(`while finding toy ${toyId}`, err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ _id: ObjectId(toyId) })
    } catch (err) {
        logger.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}

async function add(toy) {    
    try {
        const collection = await dbService.getCollection('toy')
        await collection.insertOne(toy)
        return toy
    } catch (err) {
        logger.error('cannot insert toy', err)
        throw err
    }
}

async function update(toy) {
    try {
        const toyToSave = {
            name: toy.name,
            price: toy.price
        }
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId(toy._id) }, { $set: toyToSave })
        return toy
    } catch (err) {
        logger.error(`cannot update toy ${toyId}`, err)
        throw err
    }
}

async function addToyMsg(toyId, msg) {
    console.log('msg: from service', msg)
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId(toyId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add toy msg ${toyId}`, err)
        throw err
    }
}

// async function removeCarMsg(carId, msgId) {
//     try {
//         const collection = await dbService.getCollection('car')
//         await collection.updateOne({ _id: ObjectId(carId) }, { $pull: { msgs: {id: msgId} } })
//         return msgId
//     } catch (err) {
//         logger.error(`cannot add car msg ${carId}`, err)
//         throw err
//     }
// }

// export const carService = {
//     remove,
//     query,
//     getById,
//     add,
//     update,
    // addCarMsg,
    // removeCarMsg
// }


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








// function get(toyId) {
//     const toy = toys.find(toy => toy._id === toyId)
//     if (!toy) return Promise.reject('toy not found!')
//     return Promise.resolve(toy)
// }

// function remove(toyId) {
//     console.log('toyId:', toyId)
//     const idx = toys.findIndex(toy => toy._id === toyId)
//     if (idx === -1) return Promise.reject('No Such toy')
//     // const toy = toys[idx]
//     toys.splice(idx, 1)
//     return _saveToysToFile()
// }

// function save(toy) {
//     if (toy._id) {
//         const toyToUpdate = toys.find(currToy => currToy._id === toy._id)
//         toyToUpdate.name = toy.name
//         toyToUpdate.price = toy.price
//     } else {
//         toy._id = _makeId()
//         toys.push(toy)
//     }

//     return _saveToysToFile().then(() => toy)
// }

// function _makeId(length = 5) {
//     let text = '';
//     const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     for (let i = 0; i < length; i++) {
//         text += possible.charAt(Math.floor(Math.random() * possible.length));
//     }
//     return text;
// }

// function _saveToysToFile() {
//     return new Promise((resolve, reject) => {
//         const toysStr = JSON.stringify(toys, null, 4)
//         fs.writeFile('data/toy.json', toysStr, (err) => {
//             if (err) {
//                 return console.log(err);
//             }
//             console.log('The file was saved!');
//             resolve()
//         })
//     })
// }


