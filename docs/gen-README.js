/*
 * Create pdf of m2m workshop
 * Requires node and pandoc to be installed (to convert markdown to PDF)
 *
 * To generate a PDF:
 * cd <directory where this js file is>
 * $ node gen-README.js
 * $ pandoc -s \
 *      --highlight-style=espresso \
 *      -V fontfamily=arev \
 *      -V urlcolor=blue -V geometry:margin=.2in \
 *      -V toc=true \
 *      -o README.pdf \
 *      README.md
 * This will generate a README.md (markdown) and a README.pdf (PDF)
 */
var fs = require('fs');

var outfile = 'README.md';
var home_dir = '..';

var scenarios_dir = home_dir + '/scenarios';

var scenarios = JSON.parse(fs.readFileSync("../scenarios-pathway.json"));

var outstream = fs.createWriteStream(outfile, {'encoding' : 'utf8'});


outstream.write("# " + scenarios.title + '\n\n');
outstream.write(scenarios.description + '\n\n');

outstream.write(' \
This document contains a complete set of instructions for running the workshop, split into different _scenarios_. You \
can use this document as a companion as you progress through the scenarios, but keep in mind that some of the links \
in this document may not work as they will be specific to your online environment. You will be expected to substitute your \
own values for the following URLs:\n\n \
\
* **$OPENSHIFT_MASTER** - When you see this variable, replace it with the value of your own OpenShift master url, such \
as `http://master.openshift.com:8443` (be sure to include the port!).\n\n');

function filter_katacoda(input) {
    return input
        .replace(new RegExp('/redhat-middleware-workshops/','g'), home_dir + '/')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/├/g, '+')
        .replace(/└/g, '\\')
        .replace(/│/g, '|')
        .replace(/{{execute.*}}/g, '### Run it!')
        .replace(/{{open}}/g, '')
        .replace(/{{open}}/g, '')
        .replace(/<pre.*>/g, '```java')
        .replace(/<\/pre>/g, '```')
        .replace(/\[\[HOST_SUBDOMAIN]]-.*-\[\[KATACODA_HOST]].environments.katacoda.com/g,  '$OPENSHIFT_MASTER')
        .replace(/─/g, '-');
}

var count = 1;
scenarios.courses.forEach(function(course) {

    outstream.write('# SCENARIO ' + count + ': ' + course.title + '\n\n');
    var scenario_index = JSON.parse(fs.readFileSync(scenarios_dir +'/' + course.course_id + '/index.json'));

    outstream.write('* Purpose: ' + scenario_index.description + '\n');
    outstream.write('* Difficulty: `' + scenario_index.difficulty + '`\n');
    outstream.write('* Time: `' + scenario_index.time + '`\n\n');

    var details = scenario_index.details;
    var steps = details.steps;
    var intro = scenario_index.details.intro;
    var finish = scenario_index.details.finish;

    // the intro
    outstream.write('## Intro\n');
    var introText = filter_katacoda(fs.readFileSync(scenarios_dir + '/' + course.course_id + '/' + intro.text, {'encoding' : 'utf8'}));
    outstream.write(introText + '\n\n');

    // the steps
    steps.forEach(function(step) {
        var stepTitle = step.title;
        var stepFile = step.text;
        outstream.write('## ' + stepTitle + '\n\n');
        var stepContent = filter_katacoda(fs.readFileSync(scenarios_dir + '/' + course.course_id + '/' + stepFile, {'encoding' : 'utf8'}));
        outstream.write(stepContent + '\n\n');
    });
    // the outro
    outstream.write('## Summary\n\n');
    var outroText = filter_katacoda(fs.readFileSync(scenarios_dir + '/' + course.course_id + '/' + finish.text, {'encoding' : 'utf8'}));
    outstream.write(outroText + '\n\n');

    count++;
});

outstream.end();

