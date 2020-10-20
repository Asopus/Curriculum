import { Competence } from "./competence.js";
import { Technology } from "./technology.js";

export class FileReader {

    public async ReadCompetences(): Promise<Array<Competence>>
    {
        let self = this;
        let _competences: Array<Competence> = new Array<Competence>();
        await $.ajax({
            url: "../../assets/competences/competences.json",
            type: "GET",
            success: function (response) { _competences = self.MapCompetences(response); },
            error: function (xhr, status) { }
        });

        return _competences;
    }

    private MapCompetences(response:any): Array<Competence>
    {
        let _competences: Array<Competence> = new Array<Competence>();
        for(let i=0;i< response.length;++i)
        {
            let currentCompetence = response[i];
            let technologies: Array<Technology> = new Array<Technology>();
            for(let j=0;j< currentCompetence.technologies.length;++j)
            {
                let currentTechnology = currentCompetence.technologies[j];
                technologies.push(new Technology(currentTechnology.title, currentTechnology.rating))
            }
            let competence = new Competence(currentCompetence.title, currentCompetence.imgPath, technologies);
            _competences.push(competence);
        }
        return _competences;
    }
}