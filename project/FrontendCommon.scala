import sbt._
import Keys._
import PlayProject._
import frontend.Frontend._

object FrontendCommon extends Build {

  private val appName = "frontend-common"
  private val appVersion = "1.30-SNAPSHOT"

  private val appDependencies = Seq(
    "com.gu.openplatform" %% "content-api-client" % "1.15",
    "com.gu" %% "configuration" % "3.6",
    "org.jsoup" % "jsoup" % "1.6.2",
    "org.jboss.dna" % "dna-common" % "0.6",
    "org.codehaus.jackson" % "jackson-core-asl" % "1.9.6",
    "org.codehaus.jackson" % "jackson-mapper-asl" % "1.9.6",
    "org.scalatest" %% "scalatest" % "1.7.1" % "test"
  )

  val main = PlayProject(appName, appVersion, appDependencies, mainLang = SCALA)
    .settings(compileSettings: _*)
    .settings(
      organization := "com.gu",

      testOptions in Test := Nil,
      unmanagedClasspath in Test <+= (baseDirectory) map { bd => Attributed.blank(bd / "test") },

      resolvers ++= Seq(
        "Guardian Github Releases" at "http://guardian.github.com/maven/repo-releases",
        "Typesafe Repository" at "http://repo.typesafe.com/typesafe/releases/",
        "Mvn Repository" at "http://mvnrepository.com/artifact/"
      ),

      // no javadoc
      publishArtifact in (Compile, packageDoc) := false,

      publishTo <<= (version) { version: String =>
          val publishType = if (version.endsWith("SNAPSHOT")) "snapshots" else "releases"
          Some(
              Resolver.file(
                  "guardian github " + publishType,
                  file(System.getProperty("user.home") + "/guardian.github.com/maven/repo-" + publishType)
              )
          )
      },

      templatesImport ++= Seq(
        "common._",
        "views._",
        "views.support._"
      )
  )
}
