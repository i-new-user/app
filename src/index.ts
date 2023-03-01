import express, { Request, Response, NextFunction} from 'express'
import * as dotenv from 'dotenv'
dotenv.config( { path: __dirname + '/.env' } )
import  BodyParser  from 'body-parser';
import corsMidleware  from 'cors'

const app = express();
const PORT = process.env.PORT || 5000;

app.use( BodyParser.json() )
app.use( corsMidleware() )



type VideosType = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded?: boolean,
    minAgeRestriction?: number | null | undefined,
    createAt?: string,
    publicationDate?: string,
    availableReaolutions: ResolutionsTupe
}
type ResolutionsTupe = Array<string>

type CreateVideoInputModelTupe = {
    title: string,
    author: string,
    availableResolutions?: string[],
}
type UpdateVideoInputModelTupe = {
    title: string,
    author: string,
    availableReaolutions?: Array<string>
    canBeDownloaded?: boolean,
    minAgeRestriction?: number,
    publicationDate?: string,
}
type FieldErrorTupe = {
    message: string,
    field: string,
}
type APIErrorResultTupe = {
   errorsMessages: Array<FieldErrorTupe>
}
let videos: VideosType[] = [
    {
        id: 1,
        title: 'Мёртвые души',
        author: 'Николай Васильевич Гоголь',
        canBeDownloaded: true,
        minAgeRestriction: null,
        createAt: new Date().toISOString(),
        publicationDate:  new Date().toISOString(),
        availableReaolutions: [
            'P144',
        ]
    }, 
    {
        id: 2,
        title: 'Русслан и Людмила',
        author: 'Пушкин Александр Сергеевич',
        canBeDownloaded: true,
        minAgeRestriction: null,
        createAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableReaolutions: [
            'P144',
        ]
    },
    {
        id: 3,
        title: 'Тихий дон',
        author: 'Шолохов Михаил Александрович',
        canBeDownloaded: true,
        minAgeRestriction: null,
        createAt: new Date().toISOString(), 
        publicationDate: new Date().toISOString(),
        availableReaolutions: [
            'P144',
        ]
    }
]



app.get('/', (req: Request, res: Response) => {
    res.send('Express');
})



app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos.splice(0, videos.length)
    res.send(204);
})

app.get('/videos', (req: Request, res: Response) => {
    res.send(videos);
})


app.get('/videos/:id', (req: Request, res: Response) => {
   
    const video = videos.find(v => v.id === +req.params.id);
    video 
    ? res.send(video).sendStatus(200)
    : res.sendStatus(404)
    
})

app.delete('/videos/:id', (req: Request, res: Response) => {
    for(let i = 0; i < videos.length; i++){
        if(videos[i].id === +req.params.id){
            videos.splice(i, 1)
            res.send(204)
            return;
        }
    }
    res.send(404);
})

app.post('/videos', (req: Request, res: Response) => {


    const errors = []

    
    let title = req.body.title;
    let author = req.body.author;
    let availableReaolutions = req.body.availableReaolutions;

    const newVideo: VideosType = {
        id: +(new Date()),
        title: title,
        author: author,
        canBeDownloaded: req.body.autcanBeDownloadedhor || true,
        minAgeRestriction: req.body.minAgeRestriction || null,
        createAt: req.body.createAt ||new Date().toISOString(),
        publicationDate: req.body.publicationDate || new Date().toISOString(),
        availableReaolutions: req.body.availableReaolutions || ['P144']
    }
    
    if(title.length < 1 || title.length > 40  || typeof title !== 'string' || title.trim() === ''){
        errors.push( {message: 'error', field: 'title'})
    }
    if(author.length < 1 || author.length > 20  || typeof author !== 'string' || author.trim() === ''){
        errors.push( {message: 'error', field: 'author'})
    }
    // if(!Array.isArray(availableReaolutions) || availableReaolutions.length < 1){
    //     errors.push( {message: 'error', field: 'availableReaolutions'})
    // }
    if(errors.length > 0){
        let errorsList = {errorsMessages: errors}
        res.send(errorsList).sendStatus(400)
    }
       else {
        videos.push(newVideo)
        res.send(newVideo).sendStatus(201)
    }    

})


app.put('/videos/:id', (req: Request, res: Response) => {

    const errors = []

    const video: VideosType | undefined = videos.find(v => v.id === +req.params.id)

   
   
    if(!video){
        res.sendStatus(404)
        return;
    } else  if(video){

        video.id = +(new Date())
        video.title = req.body.title;
        video.author = req.body.author;
        video.availableReaolutions = req.body.availableReaolutions || ['P144'];
        video.canBeDownloaded = req.body.canBeDownloaded || true;
        video.minAgeRestriction = req.body.minAgeRestriction || null;
        video.createAt = req.body.createAt || new Date().toISOString();
        video.publicationDate = req.body.publicationDate || new Date().toISOString();
        
        if(video.title.length > 40  || typeof video.title !== 'string' || video.title.trim() === ''){
            errors.push( {message: 'error', field: 'title'})
        }
        if(video.author.length > 20  || typeof video.author !== 'string' || video.author.trim() === ''){
            errors.push( {message: 'error', field: 'author'})
        }
        if(!Array.isArray(video.availableReaolutions) || video.availableReaolutions.length < 1){
            errors.push( {message: 'error', field: 'availableReaolutions'})
        }
        if(typeof video.canBeDownloaded !== 'boolean'){
            errors.push( {message: 'error', field: 'canBeDownloaded'})
        }
        if(typeof video.minAgeRestriction !== 'number' || (video.minAgeRestriction < 1 || video.minAgeRestriction > 18)){
            errors.push( {message: 'error', field: 'minAgeRestriction'})
        }
        if(typeof video.createAt !== 'string' || video.createAt === ''){
            errors.push( {message: 'error', field: 'minAgeRestriction'})
        }
        if(typeof video.publicationDate !== 'string' || video.publicationDate === ''){
            errors.push( {message: 'error', field: 'minAgeRestriction'})
        }
        if(errors.length > 0){
            let errorsList = {errorsMessages: errors}
            res.send(errorsList).sendStatus(400)
        }
    } else {
        res.sendStatus(204)
    }
})





app.listen(PORT, () => {
    console.log('Start');
})
