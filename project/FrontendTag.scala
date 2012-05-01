import collection.Seq
import com.google.common.io.Files

import java.io.File
import java.security.MessageDigest
import sbt._
import Keys._
import PlayProject._
import sbtassembly.Plugin._
import AssemblyKeys._
import frontend.Frontend._

object FrontendTag extends Build {

  private val appName = "frontend-tag"
  private val appVersion = "1-SNAPSHOT"

  private val appDependencies = Seq(
    //dependencies included in distribution
    "com.gu" %% "management-play" % "5.7",
    "com.gu" %% "management-logback" % "5.7",
    "com.gu" %% "frontend-common" % "1.30",

    //dependencies in test only
    "org.scalatest" %% "scalatest" % "1.7.1" % "test"
  )

  val main = PlayProject(appName, appVersion, appDependencies, mainLang = SCALA)
    .settings(frontendSettings: _*)
    .settings(
    resolvers += "Guardian Github Releases" at "http://guardian.github.com/maven/repo-releases",
    // Disable Specs options to use ScalaTest
    testOptions in Test := Nil,
    jarName in assembly := "%s.jar" format appName,
    templatesImport ++= Seq(
      "common._",
      "views._",
      "views.support._",
      "conf.Static"
    )
  )
}
