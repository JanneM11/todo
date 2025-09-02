import { pool } from "../helper/db.js";
import { Router } from "express";

const router = Router()

router.get('/',(req,res,next) => {
    pool.query('SELECT * FROM task',(err,result) => {
        if(err){
            return next(err)
        }
        res.status(200).json(result.rows)
    })
})

router.post('/create',(req,res,next) => {
    const { task } = req.body

    if(!task) {
        return next(err)
    }

    pool.query('insert into task (description) values ($1) returning *', [task.description],
        (err,result) => {
            if(err) {
                return next(err)
            }
            res.status(201).json({id: result.rows[0].id, description: task.description})
        })
})

router.delete('/delete/:id', (req,res,next) => {
    const { id } = req.params

    console.log(`Deleting task with id: ${id}`)
    pool.query('delete from task WHERE id = $1',
        [id], (err,result) => {
            if(err) {
                console.error(err.message)
                const error = new Error('Task not found')
                error.status = 404
                return next(err)
            }
            if(result.rowCount === 0) {
                return next(err)
            }
            return res.status(200).json({id:id})
        })
})

export default router
