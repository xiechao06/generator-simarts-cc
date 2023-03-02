"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const shell = require("shelljs");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the solid ${chalk.red("generator-simarts-cc")} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "projectName",
        message: "Your project name",
        default: this.appname,
        validate(projectName) {
          if (!projectName.match(/^[a-zA-Z_$][a-zA-Z_$0-9]*$/)) {
            return "Please input a valid project name";
          }
          return true;
        }
      },
      {
        type: "list",
        name: "projectType",
        message: "Your project type",
        choices: ["executable", "library"],
        default: "executable"
      },
      {
        type: "input",
        name: "version",
        message: "Your project version",
        default: "0.1.0"
      },
      {
        type: "confirm",
        name: "selfBootstrapped",
        message: "Is self-bootstrapped by vcpkg?",
        default: true
      }
    ];
    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      if (!shell.which("cmake")) {
        this.env.error("Need `cmake` to build project, please install cmake!");
      }
      if (props.selfBootstrapped) {
        if (!shell.which("git")) {
          this.env.error("Need `git` to self bootstrap, please install git!");
        }
      } else {
        if (!shell.env("VCPKG_ROOT")) {
          this.env.error(
            [
              "Your project is not self-bootstrapped by `vcpkg`",
              "but environment variable `VCPKG_ROOT` can't be found",
              "please install vcpkg globally and set `VCPKG_ROOT`!"
            ].join(", ")
          );
        }
      }
    });
  }

  writing() {
    for (const filePath of [
      "main.cc",
      ".gitignore",
      ".editorconfig",
      "tests/test.cc",
      "tests/CMakeLists.txt",
      "CMakeLists.txt"
    ]) {
      this.fs.copy(this.templatePath(filePath), this.destinationPath(filePath));
    }
    for (const [filePath, args] of [
      [
        "CMakeLists.txt",
        {
          projectName: this.props.projectName,
          selfBootstrapped: this.props.selfBootstrapped,
          version: this.props.version
        }
      ],
      [
        ".vscode/settings.json",
        {
          selfBootstrapped: this.props.selfBootstrapped
        }
      ],
      [
        ".vscode/c_cpp_properties.json",
        {
          selfBootstrapped: this.props.selfBootstrapped
        }
      ]
    ]) {
      this.fs.copyTpl(
        this.templatePath(filePath),
        this.destinationPath(filePath),
        args
      );
    }
  }

  install() {
    this.log.info(
      `Install dependencies for a ${
        this.props.selfBootstrapped
          ? "self-bootstrapped"
          : "non-self-bootstrapped"
      } project`
    );
    this.spawnCommandSync("git", ["init", "."]);
    if (this.props.selfBootstrapped) {
      this.spawnCommandSync("git", [
        "submodule",
        "add",
        "https://github.com/Microsoft/vcpkg.git"
      ]);
      this.spawnCommandSync("./vcpkg/bootstrap-vcpkg.sh");
      this.spawnCommandSync("./vcpkg/vcpkg install doctest");
    } else {
      this.spawnCommandSync(`${VCPKG_ROOT}/vcpkg install doctest}`);
    }
  }
};
