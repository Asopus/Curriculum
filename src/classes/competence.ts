import {Technology} from './technology.js';

export class Competence{
    public Title: string;
    public ImgPath: string;
    public Technologies: Technology[];
    
    constructor(title: string, imgPath: string, technologies: Array<Technology>)
    {
        this.Title = title;
        this.ImgPath = imgPath;
        this.Technologies = technologies;
    }
}