package frontend.common

import org.scalatest.FlatSpec
import org.scalatest.matchers.ShouldMatchers

import org.joda.time.DateTime
import com.gu.openplatform.contentapi.model.{ MediaAsset, Content => ApiContent, Tag => ApiTag }

class ContentTest extends FlatSpec with ShouldMatchers {

  "Trail" should "be populated properly" in {

    val media = List(
      MediaAsset("picture", "body", 1, Some("http://www.foo.com/bar"),
        Some(Map("caption" -> "caption", "width" -> "55"))),
      MediaAsset("audio", "body", 1, None, None)
    )

    val content = ApiContent("foo/2012/jan/07/bar", None, None, new DateTime, "Some article",
      "http://www.guardian.co.uk/foo/2012/jan/07/bar",
      "http://content.guardianapis.com/foo/2012/jan/07/bar",
      mediaAssets = media)

    val trail: Trail = new Content(content)

    trail.linkText should be("Some article")
    trail.url should be("/foo/2012/jan/07/bar")
    trail.images should be(List(Image(media(0))))
  }

  "Images" should "find exact size image" in {
    val imageMedia = List(image("too small", 50), image("exact size", 70), image("too big", 100))

    val images = new Images {
      def images = imageMedia.map(Image(_))
    }

    images.imageOfWidth(70).get.caption should be(Some("exact size"))
  }

  it should "not find any images if there are none in range" in {

    val imageMedia = List(image("too small", 50), image("too big", 100))

    val images = new Images {
      def images = imageMedia.map(Image(_))
    }

    images.imageOfWidth(70, tolerance = 10) should be(None)
  }

  it should "find exact size image even if there are others in the size range" in {

    val imageMedia = List(image("too small", 50), image("nearly right", 69),
      image("exact size", 70), image("too big", 100))

    val images = new Images {
      def images = imageMedia.map(Image(_))
    }

    images.imageOfWidth(70, tolerance = 10).get.caption should be(Some("exact size"))
  }

  it should "find image with closest size in range" in {

    val imageMedia = List(image("too small", 50), image("find me", 69),
      image("i will lose out", 75), image("too big", 100))

    val images = new Images {
      def images = imageMedia.map(Image(_))
    }

    images.imageOfWidth(70, tolerance = 10).get.caption should be(Some("find me"))
  }

  "Tags" should "understand tag types" in {

    val theKeywords = Seq(Tag(tag("/keyword1", "keyword")), Tag(tag("/keyword2", "keyword")))
    val theSeries = Seq(Tag(tag("/series", "series")))
    val theContributors = Seq(Tag(tag("/contributor", "contributor")))
    val theTones = Seq(Tag(tag("/tone", "tone")))
    val theBlogs = Seq(Tag(tag("/blog", "blog")))

    val tags = new Tags {
      override val tags = theBlogs ++ theTones ++ theContributors ++ theSeries ++ theKeywords
    }

    tags.keywords should be(theKeywords)

    tags.contributors should be(theContributors)

    tags.blogs should be(theBlogs)

    tags.tones should be(theTones)

    tags.series should be(theSeries)

  }

  "Content" should "understand the meta data used by the plugins framework" in {

    val webPublicationDate = new DateTime

    val tags = List(
      tag(id = "/keyword1", name = "Keyword_1", tagType = "keyword"),
      tag(id = "/keyword2", name = "Keyword_2", tagType = "keyword"),
      tag(id = "/contributor1", name = "Contributor_1", tagType = "contributor"),
      tag(id = "/contributor2", name = "Contributor_2", tagType = "contributor"),
      tag(id = "/series1", name = "Series_1", tagType = "series"),
      tag(id = "/series2", name = "Series_2", tagType = "series"),
      tag(id = "/tone1", name = "Tone_1", tagType = "tone"),
      tag(id = "/tone2", name = "Tone_2", tagType = "tone"),
      tag(id = "/blog1", name = "Blog_1", tagType = "blog"),
      tag(id = "/blog2", name = "Blog_2", tagType = "blog")
    )

    val fields = Map(
      "publication" -> "The Guardian",
      "shortUrl" -> "http://gu.com/p/12345",
      "byline" -> "Jack and Jill",
      "commentable" -> "true",
      "trailText" -> "The trail text"
    )

    val metaData = new Content(ApiContent(
      id = "foo/2012/jan/07/bar",
      sectionId = Some("section"),
      sectionName = None,
      webPublicationDate = webPublicationDate,
      webTitle = "Some article",
      webUrl = "http://www.guardian.co.uk/foo/2012/jan/07/bar",
      apiUrl = "http://content.guardianapis.com/foo/2012/jan/07/bar",
      fields = Some(fields),
      tags = tags
    )).metaData

    //      "tag-ids" -> tags.map(_.id).mkString(","),

    metaData("page-id") should be("foo/2012/jan/07/bar")
    metaData("short-url") should be("http://gu.com/p/12345")
    metaData("publication") should be("The Guardian")
    metaData("byline") should be("Jack and Jill")
    metaData("commentable") should be("true")
    metaData("description") should be("The trail text")
    metaData("keywords") should be("Keyword_1,Keyword_2")
    metaData("section") should be("section")
    metaData("author") should be("Contributor_1,Contributor_2")
    metaData("tones") should be("Tone_1,Tone_2")
    metaData("series") should be("Series_1,Series_2")
    metaData("blogs") should be("Blog_1,Blog_2")
    metaData("web-publication-date") should be(webPublicationDate)
    metaData("api-url") should be("http://content.guardianapis.com/foo/2012/jan/07/bar")
    metaData("web-title") should be("Some article")

    metaData("tag-ids") should
      be("/keyword1,/keyword2,/contributor1,/contributor2,/series1,/series2,/tone1,/tone2,/blog1,/blog2")

  }

  private def tag(id: String = "/id", tagType: String = "keyword", name: String = "") = {
    ApiTag(id = id, `type` = tagType, webTitle = name,
      sectionId = None, sectionName = None, webUrl = "weburl", apiUrl = "apiurl", references = Nil)
  }

  private def image(caption: String, width: Int) = {
    MediaAsset("picture", "body", 1, Some("http://www.foo.com/bar"),
      Some(Map("caption" -> caption, "width" -> width.toString)))
  }

}
