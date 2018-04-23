/*
 * Create pdf of m2m workshop
 * Requires node and pandoc to be installed (to convert markdown to PDF)
 *
 * To generate a PDF:
 * cd <directory where this js file is>
   node gen-README.js
   cd cdk-docs/md
   for md in *.md ; do
     echo "processing $md"
     OUT=../pdf/$(echo $md|sed 's/.md$/.pdf/')
     pandoc -s \
          --highlight-style=espresso \
          -V fontfamily=arev \
          -V urlcolor=blue -V geometry:margin=.2in \
          -V toc=true \
          -o $OUT \
          $md
   done

 * This will generate a markdown file and PDF file for each of the scenarios, plus an intro/prereq doc
 */
const fs = require('fs');
const HOME_DIR = '..';
const SCENARIOS_DIR = HOME_DIR + '/scenarios';
const SCENARIOS = JSON.parse(fs.readFileSync("../scenarios-pathway.json"));
const SKIPPED_COURSES = ['getting-started'];
const OUT_DIR='cdk-docs';

var prereq_out = fs.createWriteStream(OUT_DIR+'/md/README.md', {'encoding': 'utf8'});

var count = 1;

  prereq_out.write("# Scenario Index\n\n");

SCENARIOS.courses.filter(function (course) {
  return SKIPPED_COURSES.indexOf(course.course_id) === -1;

}).forEach(function (course, idx) {
  prereq_out.write('* Scenario ' + (idx+1) + ' - [' + course.title + '](' + '0' + (idx+1) + '-' + course.course_id + '.md)\n\n');
});

prereq_out.write("# " + SCENARIOS.title + '\n\n');
prereq_out.write(SCENARIOS.description + '\n\n');

prereq_out.write(' \
These documents contains a complete set of instructions for running the workshop, split into different _scenarios_. You \
can use these documents as a companion as you progress through the scenarios, but keep in mind that some of the links \
in this document may not work as they will be specific to your online environment. You will be expected to substitute your \
own values for the following URLs:\n\n \
\
* **$OPENSHIFT_MASTER** - When you see this variable, replace it with the value of your own OpenShift master hostname/port, such \
as `https://master.openshift.com:8443` (be sure to include the port!).\n\n \
* **$ROUTE_SUFFIX** - When you see this variable, replace it with the value of your own OpenShift default routing suffix. \
For example, if you see `http://coolstore-dev.$ROUTE_SUFFIX` then you would replace this with `http://coolstore-dev.apps.mycompany.com` \
assuming your OpenShift cluster uses a default routing suffix of `apps.mycompany.com`.\n\n');

var prereqs = fs.readFileSync("prereqs.md");

prereq_out.write(prereqs + "\n\n");

function filter_katacoda(input) {
  return input
    .replace(new RegExp('/redhat-middleware-workshops/', 'g'), HOME_DIR + '/../../')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/.*ip-address.*/, '')
    .replace(/├/g, '+')
    .replace(/└/g, '\\')
    .replace(/│/g, '|')
    .replace(/─/g, '-')
    .replace(/{{execute.*}}/g, '')
    .replace(/{{open}}/g, '')
    .replace(/{{open}}/g, '')
    .replace(/\[\/\/]:\s*#\s\(CDK\s*(.*)\)/g, '$1')
    .replace(/\s+[cC]lick\s+\*\*[cC]opy [tT]o [eE]ditor\*\*\s+/, ' Open the file ')
    .replace(/[cC]lick.* here to open/g, 'Open')
    .replace(/<pre.*>/g, '```java')
    .replace(/<\/pre>/g, '```')
    .replace(/```console/g, '```')
    .replace(/--server https:\/\/master:8443/g, '')
    .replace(/\[(.*)]\(https:\/\/\[\[HOST_SUBDOMAIN]]-8443-\[\[KATACODA_HOST]].environments.katacoda.com(.*)\)/g, '$1 at \n\n`https://$OPENSHIFT_MASTER$2`')
    .replace(/\[(.*)]\(http:\/\/(.*)\[\[HOST_SUBDOMAIN]]-80-\[\[KATACODA_HOST]].environments.katacoda.com(.*)\)/g, '$1 at \n\n`http://$2$ROUTE_SUFFIX$3`')

    .replace(/https:\/\/\[\[HOST_SUBDOMAIN]]-8443-\[\[KATACODA_HOST]].environments.katacoda.com(.*)\)/g, '\n\n`https://$OPENSHIFT_MASTER$1`')
    .replace(/http:\/\/(.*)\[\[HOST_SUBDOMAIN]]-80-\[\[KATACODA_HOST]].environments.katacoda.com(.*)\)/g, '$1 at \n\n`http://$1$ROUTE_SUFFIX$2`')

    .replace(/\[(.*)]\(https:\/\/\[\[HOST_SUBDOMAIN]]-(.*)-\[\[KATACODA_HOST]].environments.katacoda.com(.*)\)/g, '$1 at \n\n`http://localhost:$2`')

  ;
}

prereq_out.end();
SCENARIOS.courses.filter(function (course) {
  return SKIPPED_COURSES.indexOf(course.course_id) === -1;

}).forEach(function (course, idx) {
  console.log("Processing course " + course.title);

  const outstream = fs.createWriteStream(OUT_DIR+'/md/0' + (idx+1) + '-' + course.course_id + '.md' , {'encoding': 'utf8'});
  outstream.write('# SCENARIO ' + (idx+1) + ': ' + course.title + '\n\n');
  var scenario_index = JSON.parse(fs.readFileSync(SCENARIOS_DIR + '/' + course.course_id + '/index.json'));

  outstream.write('* Purpose: ' + scenario_index.description + '\n');
  outstream.write('* Difficulty: `' + scenario_index.difficulty + '`\n');
  outstream.write('* Time: `' + scenario_index.time + '`\n\n');

  var details = scenario_index.details;
  var steps = details.steps;
  var intro = scenario_index.details.intro;
  var finish = scenario_index.details.finish;
  var assets = scenario_index.details.assets;

  // the intro
  outstream.write('## Intro\n');
  var introText = filter_katacoda(fs.readFileSync(SCENARIOS_DIR + '/' + course.course_id + '/' + intro.text, {'encoding': 'utf8'}));
  outstream.write(introText + '\n\n');

  // the setup scripts
  outstream.write('## Setup for Exercise\n\n');
  outstream.write("Run the following commands to set up your environment for this scenario and start in the right directory:\n\n");
  outstream.write("```sh\n");
  outstream.write(filter_katacoda(fs.readFileSync(SCENARIOS_DIR + '/' + course.course_id + '/' + intro.code, {'encoding': 'utf8'})));
  outstream.write('```\n\n');

  // the steps
  steps.forEach(function (step) {
    var stepTitle = step.title;
    var stepFile = step.text;
    outstream.write('## ' + stepTitle + '\n\n');
    var stepContent = filter_katacoda(fs.readFileSync(SCENARIOS_DIR + '/' + course.course_id + '/' + stepFile, {'encoding': 'utf8'}));
    outstream.write(stepContent + '\n\n');
  });
  // the outro
  outstream.write('## Summary\n\n');
  var outroText = filter_katacoda(fs.readFileSync(SCENARIOS_DIR + '/' + course.course_id + '/' + finish.text, {'encoding': 'utf8'}));
  outstream.write(outroText + '\n\n');

  // the appendices
  if (assets) {
    var files = [];
    for (const [ entry, assetArray ] of Object.entries(assets)) {
      assetArray.forEach(function(asset) {
        if (asset.file && asset.file[0] !== '.') {
          files.push(asset.file);
        }
      })
    }
  }

  if (files && files.length > 0) {
    console.log("Adding Appendix files: " + JSON.stringify(files));
    outstream.write('## Appendix\n\nThe contents of these files are used during this scenario exercise. Please refer to the scenario for how to use them!\n\n');

    files.forEach(function (file) {
      outstream.write('### File: `' + file + '`\n\n');
      outstream.write('```bash\n');
      outstream.write(fs.readFileSync(SCENARIOS_DIR + '/' + course.course_id + '/assets/' + file, {'encoding': 'utf8'}));
      outstream.write('\n\n```\n\n');
    });
  }

  outstream.end();
});


