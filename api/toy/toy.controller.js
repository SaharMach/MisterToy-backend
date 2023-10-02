import { logger } from '../../services/logger.service.js'
import { toyService } from './toy.service.js'
import { socketService } from '../../services/socket.service.js'


export async function getToys(req, res) {
    try {
        console.log('entered!!!!');
        const filterBy = { 
            txt: req.query.txt || '',
            inStock: req.query.inStock || null,
            labels: req.query.labels || [],
            sortBy: req.query.sortBy || '' 
        }
        const toys = await toyService.query(filterBy)
        res.json(toys)
    } catch (err) {
        res.status(500).send({ err: 'Failed to get toys' })
    }
}

export async function getToyById(req, res) {
    try {
        const toyId = req.params.id
        const toy = await toyService.getById(toyId)
        
        res.json(toy)
    } catch (err) {
        // logger.error('Failed to get car', err)
        res.status(500).send({ err: 'Failed to get car' })
    }
}

export async function addToy(req, res) {
    const { loggedinUser } = req
    try {
        const { name, price } = req.body
        const newToy = toyService.getEmptyToy(name,price)
        // toy.owner = loggedinUser
        const addedToy = await toyService.add(newToy)
        socketService.broadcast({ type: 'toy-added', data: addedToy, userId: loggedinUser._id })
        res.json(addedToy)
    } catch (err) {
        // logger.error('Failed to add car', err)
        res.status(500).send({ err: 'Failed to add toy' })
    }
}

export async function updateToy(req, res) {
    try {
        const toy = req.body
        const updatedToy = await toyService.update(toy)
        console.log('updatedToy:', updatedToy)
        res.json(updatedToy)
    } catch (err) {
        // logger.error('Failed to update car', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

export async function removeToy(req, res) {
    const { loggedinUser } = req

    try {
        const toyId = req.params.id
        await toyService.remove(toyId)
        socketService.broadcast({ type: 'toy-removed', data: toyId, userId: loggedinUser._id })

        res.send()
    } catch (err) {
        // logger.error('Failed to remove car', err)
        res.status(500).send({ err: 'Failed to remove car' })
    }
}

export async function addToyMsg(req, res) {
    console.log('req.body.txt:', req.body.txt)
    const { loggedinUser } = req
    try {
        const toyId = req.params.id
        const msg = {
            txt: req.body.txt,
            by: loggedinUser,
        }
        const savedMsg = await toyService.addToyMsg(toyId, msg)
        res.json(savedMsg)
    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

// export async function removeToyMsg(req, res) {
//     const { loggedinUser } = req
//     try {
//         const carId = req.params.id
//         const { msgId } = req.params

//         const removedId = await carService.removeCarMsg(carId, msgId)
//         res.send(removedId)
//     } catch (err) {
//         logger.error('Failed to remove car msg', err)
//         res.status(500).send({ err: 'Failed to remove car msg' })
//     }
// }