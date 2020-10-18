class Competence{
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

class Technology
{
    public Title: string;
    public Rating: number;

    constructor(title: string, rating: number)
    {
        this.Title = title;
        this.Rating = rating;
    }
}