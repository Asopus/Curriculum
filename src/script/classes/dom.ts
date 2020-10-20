import { Competence } from "./competence.js";

export class Dom {

    private _numbers = ["one","two","three","four","five"];
    private _skillLevels = ["Novice", "Elementary", "Intermediate", "Advanced", "Expert"];
    private _competences: Array<Competence> = [];
    private _instructionElement: HTMLElement = this.GetElementById("instruction");
    private _fileReader:FileReader = new FileReader();

    constructor(competences:Array<Competence>) {
        this._competences = competences;
    }

    public RemoveStartInstruction()
    {
        this.RemoveClasses(this._instructionElement, "blink");
    }

    public ShowBasket()
    {
        this.GetElementById("toCollect").innerText = "\xA0/ " + this._competences.length;
        let basket = this.GetElementById("apple-basket");
        this.RemoveClasses(basket, "invisible");
        this.AddClasses(basket, "animate__animated", "animate__bounceInLeft");
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

    public SetInstruction(instruction: string)
    {
        this._instructionElement.innerText = instruction;
    }

    public AddCompetence()
    {
        let score = this.GetElementById("score");
        let oldScore = parseInt(score.innerText);
        if(oldScore != this._competences.length)
        {
            let currentCompetence = this._competences[oldScore];
            score.innerText = (oldScore + 1).toString();
            let competences = this.GetElementById("competences");
            let competence =  document.createElement("div");
            this.AddClasses(competence, "competence", "animate__animated", "animate__swing", "animate__slow");
            competence.setAttribute('data-target', "#competenceCarousel");
            competence.setAttribute('data-slide-to', oldScore.toString());        
            let competenceTitle = document.createElement("span");
            competenceTitle.innerHTML = currentCompetence.Title;
            competence.appendChild(competenceTitle);
            competences.appendChild(competence);
            
            let carousel = this.GetElementById("innerCarousel");

            let carouselItem = document.createElement("div");
            this.AddClasses(carouselItem, "carousel-item");

            if (oldScore == 0)
            {
                this.AddClasses(carouselItem, "active");
            }

            let technologyHeader = document.createElement("div");
            this.AddClasses(technologyHeader, "row", "header", "competence-technologies");
            let headerName = document.createElement("div");
            this.AddClasses(headerName, "col", "competence-header-name");
            headerName.innerText= currentCompetence.Title;

            technologyHeader.appendChild(headerName);

            for (let i=0;i<this._numbers.length;++i)
            {
                let titleElement = document.createElement("div");
                this.AddClasses(titleElement, "col", this._numbers[i]);
                titleElement.innerText= this._skillLevels[i];
                technologyHeader.appendChild(titleElement);
            }
            
            carouselItem.appendChild(technologyHeader);

            for (let i=0;i<currentCompetence.Technologies.length;++i)
            {
                let currentTechnology = currentCompetence.Technologies[i];
                let technologies = document.createElement("div");
                this.AddClasses(technologies, "row", "competence-technologies");
                let nameElement = document.createElement("div");
                this.AddClasses(nameElement, "col", "name");
                let namespan = document.createElement("span");
                namespan.innerText = currentTechnology.Title;
                nameElement.appendChild(namespan);
                technologies.appendChild(nameElement);

                for (let j=0;j<currentTechnology.Rating;++j)
                {
                    let imgContainer = document.createElement("div");
                    this.AddClasses(imgContainer, "col", this._numbers[j]);
                    let imgElement = document.createElement("img");
                    imgElement.width = 25;
                    imgElement.height = 30;
                    imgElement.src = "../../assets/img/apple.png";
                    imgContainer.appendChild(imgElement);
                    technologies.appendChild(imgContainer);
                }

                carouselItem.appendChild(technologies);
            }

            carousel.appendChild(carouselItem);
        }

        if (oldScore == this._competences.length - 1)
        {
            let competences = this.GetElementById("competences");
            let firstCompetence = competences.children[0] as HTMLElement;
            this.RemoveClasses(firstCompetence, "animate__swing");
            this.AddClasses(firstCompetence, "animate__tada", "animate__infinite");
            firstCompetence.addEventListener("click", this.RemoveAttentionSeeker)
        }
    }
    
    public ConfigureModalFocus()
    {
        $('#competenceModal').keydown(function(e) {
            if (e.keyCode === 37) {
               $(".carousel-control-prev-icon").click();
            }
            if (e.keyCode === 39) {
               $(".carousel-control-next-icon").click();
            }
        });
    }

    private RemoveAttentionSeeker() {
        let competences = document.getElementById("competences");
        let firstCompetence = competences.children[0] as HTMLElement;
        firstCompetence.classList.remove("animate__tada");
        firstCompetence.classList.remove("animate__infinite");
        firstCompetence.removeEventListener("click", this.RemoveAttentionSeeker)
    }
}