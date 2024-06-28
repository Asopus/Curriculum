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

    public GetElementsByClassName<TType extends HTMLElement>(className:string) : HTMLCollectionOf<TType>
    {
       return document.getElementsByClassName(className) as HTMLCollectionOf<TType>;
    }

    public AddCompetenceDetails() {
        let carousel = this.GetElementById("innerCarousel");
        for (let i=0;i<this._competences.length;++i)
        {
            let competence = this._competences[i];
            let carouselItem = this.CreateCompetenceDetail(competence, );

            if (i == 0)
            {
                this.AddClasses(carouselItem, "active");
            }

            carousel.appendChild(carouselItem);
        };
    }

    private CreateCompetenceDetail(competence:Competence): HTMLDivElement
    {
        let carouselItem = document.createElement("div");

        this.AddClasses(carouselItem, "carousel-item");
        carouselItem.appendChild(this.CreateTechnologyHeader(competence));
        this.CreateTechnologyRows(competence).forEach(technology => {
            carouselItem.appendChild(technology);
        });

        return carouselItem;
    }

    private CreateTechnologyRows(competence:Competence): Array<HTMLDivElement>
    {
        let technologies:Array<HTMLDivElement> = []
        for (let i=0;i<competence.Technologies.length;++i)
        {
            let currentTechnology = competence.Technologies[i];
            let skills = document.createElement("div");
            this.AddClasses(skills, "row", "competence-technologies");
            let nameElement = document.createElement("div");
            this.AddClasses(nameElement, "col", "name");
            let namespan = document.createElement("span");
            namespan.innerText = currentTechnology.Title;
            nameElement.appendChild(namespan);
            skills.appendChild(nameElement);

            for (let j=0;j<currentTechnology.Rating;++j)
            {
                let imgContainer = document.createElement("div");
                this.AddClasses(imgContainer, "col", this._numbers[j]);
                let imgElement = document.createElement("img");
                imgElement.width = 25;
                imgElement.height = 30;
                imgElement.src = "../../assets/img/apple.png";
                imgContainer.appendChild(imgElement);
                skills.appendChild(imgContainer);
            }

            technologies.push(skills);
        }

        return technologies;
    }

    
    private CreateTechnologyHeader(competence:Competence): HTMLDivElement
    {
        let technologyHeader = document.createElement("div");
        this.AddClasses(technologyHeader, "row", "header", "competence-technologies");
        let headerName = document.createElement("div");
        this.AddClasses(headerName, "col", "competence-header-name");
        headerName.innerText= competence.Title;

        technologyHeader.appendChild(headerName);

        for (let i=0;i<this._numbers.length;++i)
        {
            let titleElement = document.createElement("div");
            this.AddClasses(titleElement, "col", this._numbers[i]);
            titleElement.innerText= this._skillLevels[i];
            technologyHeader.appendChild(titleElement);
        }

        return technologyHeader;
    }

    public AddCompetenceButton(): boolean
    {
        let scoreElement = this.GetElementById("score");
        let score = parseInt(scoreElement.innerText);
        if(score != this._competences.length)
        {
            let currentCompetence = this._competences[score];
            scoreElement.innerText = (score + 1).toString();
            let competences = this.GetElementById("competences");
            let competence =  document.createElement("div");
            this.AddClasses(competence, "competence", "animate__animated", "animate__swing", "animate__slow");
            competence.setAttribute('data-target', "#competenceCarousel");
            competence.setAttribute('data-slide-to', score.toString());  
            let competenceTitle = document.createElement("span");
            competenceTitle.innerHTML = currentCompetence.Title;
            competence.appendChild(competenceTitle);
            competences.appendChild(competence);
            
            return score == this._competences.length - 1;
        }

        return false;
    }

    public AddAboutButton()
    {
            let competences = this.GetElementById("about");
            let competence =  document.createElement("div");
            this.AddClasses(competence, "competence", "animate__animated", "animate__swing", "animate__slow");
            let competenceTitle = document.createElement("span");
            competence.setAttribute('data-target', "#completedModal");
            competence.setAttribute('data-toggle', "modal");
            competenceTitle.innerHTML = "About";
            competence.appendChild(competenceTitle);
            competences.appendChild(competence);
    }

    public ShowCompletedModal()
    {
        $("#completedModal").modal("show");
    }
    
    public ConfigureModalFocus()
    {
        $('#competenceModal').keydown(function(e) {
            if (e.keyCode === 37) {
                $('#competenceCarousel').carousel('prev');
            }
            if (e.keyCode === 39) {
                $('#competenceCarousel').carousel('next');
            }
        });

        $('#carousel-prev').click(function() {
            $('#competenceCarousel').carousel('prev');
        });

        $('#carousel-next').click(function() {
            $('#competenceCarousel').carousel('next');
        });
    }
}