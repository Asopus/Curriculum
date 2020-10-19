import { Competence } from "./competence.js";

export class Dom{
    

    private _numbers = ["one","two","three","four","five"];
    private _skillLevels = ["Novice", "Elementary", "Intermediate", "Advanced", "Expert"];
    private _competences: Array<Competence>;
    private _instructionElement: HTMLElement = document.getElementById("instruction");

    constructor(competences: Array<Competence>){
        this.SetModalFocus();
        this._competences = competences;
        document.getElementById("toCollect").innerText = "\xA0/ " + this._competences.length;
    }

    public Init()
    {
        this._instructionElement.classList.remove("blink");
        this._instructionElement.innerText = "Press spacebar to pause";
        let basket = document.getElementById("apple-basket");
        basket.classList.remove("invisible");
        basket.classList.add("animate__animated");
        basket.classList.add("animate__bounceInLeft");
    }

    public SetInstruction(instruction: string)
    {
        this._instructionElement.innerText = instruction;
    }

    public AddCompetence()
     {
         let score = document.getElementById("score") as HTMLElement;
         let oldScore = parseInt(score.innerText);
         if(oldScore != this._competences.length)
         {
             let currentCompetence = this._competences[oldScore];
             score.innerText = (oldScore + 1).toString();
             let competences = document.getElementById("competences") as HTMLElement;
             let competence =  document.createElement("div");
             competence.classList.add("competence");
             competence.classList.add("animate__animated");
             competence.classList.add("animate__swing");
             competence.classList.add("animate__slow");
             competence.setAttribute('data-target', "#competenceCarousel");
             competence.setAttribute('data-slide-to', oldScore.toString());        
             let competenceTitle = document.createElement("span");
             competenceTitle.innerHTML = currentCompetence.Title;
             competence.appendChild(competenceTitle);
             competences.appendChild(competence);
             
             let carousel = document.getElementById("innerCarousel") as HTMLElement;
 
             let carouselItem = document.createElement("div");
             carouselItem.classList.add("carousel-item");
 
             if (oldScore == 0)
             {
                 carouselItem.classList.add("active");
             }
 
             let technologyHeader = document.createElement("div");
             technologyHeader.classList.add("row");
             technologyHeader.classList.add("competence-technologies");
             technologyHeader.classList.add("header");
             let headerName = document.createElement("div");
             headerName.classList.add("col");
             headerName.classList.add("competence-header-name");
             headerName.innerText= currentCompetence.Title;
 
             technologyHeader.appendChild(headerName);
 
             for (let i=0;i<this._numbers.length;++i)
             {
                 let titleElement = document.createElement("div");
                 titleElement.classList.add("col");
                 titleElement.classList.add(this._numbers[i]);
                 titleElement.innerText= this._skillLevels[i];
                 technologyHeader.appendChild(titleElement);
             }
             
             carouselItem.appendChild(technologyHeader);
 
             for (let i=0;i<currentCompetence.Technologies.length;++i)
             {
                 let currentTechnology = currentCompetence.Technologies[i];
                 let technologies = document.createElement("div");
                 technologies.classList.add("row");
                 technologies.classList.add("competence-technologies");
                 let nameElement = document.createElement("div");
                 nameElement.classList.add("name");
                 nameElement.classList.add("col");
                 let namespan = document.createElement("span");
                 namespan.innerText = currentTechnology.Title;
                 nameElement.appendChild(namespan);
                 technologies.appendChild(nameElement);
 
                 for (let j=0;j<currentTechnology.Rating;++j)
                 {
                     let imgContainer = document.createElement("div");
                     imgContainer.classList.add(this._numbers[j]);
                     imgContainer.classList.add("col");
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
             let competences = document.getElementById("competences") as HTMLElement;
             competences.children[0].classList.remove("animate__swing");
             competences.children[0].classList.add("animate__tada");
             competences.children[0].classList.add("animate__infinite");
             competences.children[0].addEventListener("click", this.RemoveAttentionSeeker)
         }
     }
    
    private SetModalFocus()
    {
        $('#competenceModal').keydown(function(e) {
            if (e.keyCode === 37) {
               // Previous
               $(".carousel-control-prev-icon").click();
               return false;
            }
            if (e.keyCode === 39) {
               // Next
               $(".carousel-control-next-icon").click();
               return false;
            }
        });
    }

    private RemoveAttentionSeeker() {
        let competences = document.getElementById("competences") as HTMLElement;
        competences.children[0].classList.remove("animate__tada");
        competences.children[0].classList.remove("animate__infinite");
        competences.children[0].removeEventListener("click", this.RemoveAttentionSeeker)
    }
}