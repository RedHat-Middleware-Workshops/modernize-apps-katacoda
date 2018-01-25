package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"

	rice "github.com/GeertJohan/go.rice"
	"github.com/husobee/vestigo"
)

type TrainingPageData struct {
	Name  string
}
type ScenarioPageData struct {
	Training TrainingPageData
	Name  string
}

var templates = template.New("").Funcs(templateMap)
var templateBox *rice.Box

func newTemplate(path string, _ os.FileInfo, _ error) error {
	if path == "" {
		return nil
	}
	templateString, err := templateBox.String(path)
	if err != nil {
		log.Panicf("Unable to parse: path=%s, err=%s", path, err)
	}
	templates.New(filepath.Join("templates", path)).Parse(templateString)
	return nil
}

func renderTemplate(w http.ResponseWriter, tmpl string, p interface{}) {
	err := templates.ExecuteTemplate(w, tmpl, p)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func training(w http.ResponseWriter, r *http.Request) {
	pageData := TrainingPageData{Name: vestigo.Param(r, "training")}
	renderTemplate(w, "templates/training.html", &pageData)
}
func scenario(w http.ResponseWriter, r *http.Request) {
	pageData := ScenarioPageData{Name: vestigo.Param(r, "scenario"), Training: TrainingPageData{Name: vestigo.Param(r, "training")}}
	renderTemplate(w, "templates/scenario.html", &pageData)
}

func index(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "templates/index.html", nil)
}

func main() {
	templateBox = rice.MustFindBox("templates")
	templateBox.Walk("", newTemplate)

	router := vestigo.NewRouter()

	router.Get("/", index)
	router.Get("/static/*", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))).ServeHTTP)
	router.Get("/:training", training)
	router.Get("/:training/", training)
	router.Get("/:training/:scenario", scenario)
	router.Get("/:training/:scenario/", scenario)

	http.Handle("/", router)

	log.Print("Listening on 0.0.0.0:3000...")
	log.Fatal(http.ListenAndServe("0.0.0.0:3000", nil))
}
