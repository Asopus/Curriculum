import { Competence } from "./competence.js";
import { Technology } from "./technology.js";

export class Api {

    public async ReadCompetences(): Promise<Array<Competence>>
    {
        let _competences: Array<Competence> = new Array<Competence>();

        await $.ajax({
            url: "../../assets/competences/competences.json",
            type: "GET",
            success: function (response) {
                let result = response;
                for(let i=0;i< result.length;++i)
                {
                    let currentCompetence = result[i];
                    let technologies: Array<Technology> = new Array<Technology>();
                    for(let j=0;j< currentCompetence.technologies.length;++j)
                    {
                        let currentTechnology = currentCompetence.technologies[j];
                        technologies.push(new Technology(currentTechnology.title, currentTechnology.rating))
                    }
                    let competence = new Competence(currentCompetence.title, currentCompetence.imgPath, technologies);
                    _competences.push(competence);
                }
                this._competences = _competences;
            },
            error: function (xhr, status) {
                console.log(xhr);
                console.log(status);
            }
        });

        return _competences;
    }
}