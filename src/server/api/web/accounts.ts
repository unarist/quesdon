import * as Router from "koa-router"
import * as mongoose from "mongoose"
import { User, Question } from "../../db/index";

var router = new Router

router.get("/verify_credentials", async ctx => {
    if (!ctx.session!.user) return ctx.throw("please login", 403)
    const user = await User.findById(ctx.session!.user)
    if (!user) return ctx.throw("not found", 404)
    ctx.body = user
})

router.get("/id/:id", async ctx => {
    const user = await User.findById(ctx.params.id)
    if (!user) return ctx.throw("not found", 404)
    ctx.body = user
})


router.get("/:acct", async ctx => {
    const user = await User.findOne({acctLower: ctx.params.acct.toLowerCase()})
    if (!user) return ctx.throw("not found", 404)
    ctx.body = user
})

router.post("/:acct/question", async ctx => {
    const user = await User.findOne({acctLower: ctx.params.acct.toLowerCase()})
    if(!user) return ctx.throw("not found", 404)
    var question = new Question
    question.question = ctx.request.body.fields.question
    question.user = user
    await question.save()
    ctx.body = {status: "ok"}
})

router.get("/:acct/questions", async ctx => {
    const user = await User.findOne({acctLower: ctx.params.acct.toLowerCase()})
    if(!user) return ctx.throw("not found", 404)
    const questions = await Question.find({
        user,
        answeredAt: {$ne: null}
    }).sort("-answeredAt")
    ctx.body = questions
})


export default router