import { Competence } from "../model/competence.js";
import { Technology } from "../model/technology.js";
declare var $: any;

export class Dom {

    private _numbers = ["one","two","three","four","five"];
    private _skillLevels = ["Novice", "Elementary", "Intermediate", "Advanced", "Expert"];
    private _competences: Array<Competence> = [];
    private _fileReader:FileReader = new FileReader();

    constructor(competences:Array<Competence>) {
        this._competences = competences;
    }


    public RemoveClasses(element:HTMLElement, ...classes:string[])
    {
        for(let i=0;i<classes.length;++i)
        {            
            element.classList.remove(classes[i]);
        }
    }

    public AddClasses(element:HTMLElement, ...classes:string[])
    {
        for(let i=0;i<classes.length;++i)
        {            
            element.classList.add(classes[i]);
        }
    }

    public GetElementById<TType extends HTMLElement>(id:string) : TType
    {
       return document.getElementById(id) as TType;
    }

    public GetElementsByClassName<TType extends HTMLElement>(className:string) : HTMLCollectionOf<TType>
    {
       return document.getElementsByClassName(className) as HTMLCollectionOf<TType>;
    }


    
    public UnblurRebusPiece(blurLevel:number): boolean
    {
        if(blurLevel < 0) return;
        var rebus = document.getElementById('rebus');
        rebus.className = "blur-" + blurLevel;
        return;
    }
}