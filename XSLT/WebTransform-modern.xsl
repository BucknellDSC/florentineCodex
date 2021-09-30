<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    exclude-result-prefixes="xs tei xhtml"
    version="2.0">
    
    <xsl:output doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
        doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"
        method="xhtml" omit-xml-declaration="yes" indent="yes" encoding="UTF-8"/>
    <xsl:strip-space elements="*"/>
    
    <xsl:template match="/">
        <xsl:apply-templates/>
    </xsl:template>
    
    <xsl:template match="tei:TEI">
        <html>
            <head>
                <xsl:comment>This document is generated from a TEI Master--do not edit!</xsl:comment>
                <title><xsl:value-of select="tei:teiHeader/tei:fileDesc/tei:titleStmt/tei:title"/></title>
                <link rel="stylesheet" type="text/css" href="../CSS/MemStyle.css"/>
            </head>
            <body><xsl:apply-templates select="tei:text"/></body>
        </html>
    </xsl:template>

<!-- Identifies Book by number, and then bold -->
    <xsl:template match="tei:div1">
        <h3>
            <xsl:text>Book </xsl:text>
            <xsl:value-of select="@n"/>
            <xsl:text></xsl:text>
        </h3>
        <xsl:apply-templates/>
    </xsl:template>
    
    <xsl:template match="tei:div1/tei:head[@xml:lang='sp']">
        <h4>   <xsl:text>Spanish: </xsl:text>         
        <xsl:apply-templates/>
</h4>
    </xsl:template>

<xsl:template match="tei:div1/tei:head[@xml:lang='na']">
       <h4> <xsl:text>Nahuatl: </xsl:text>
    <xsl:apply-templates/>
</h4>
</xsl:template>
    
<!-- Identifies Chapter by number, and then bold -->    
<xsl:template match="tei:div2">
   <hr/>
    <strong> 
       <xsl:text>Chapter </xsl:text>
    <xsl:value-of select="@n"/>
        <xsl:text>: </xsl:text>
   </strong>
    <p/>    
    <xsl:apply-templates/>
</xsl:template>
<!-- Identifies Folio by number, and then italic -->    
 <xsl:template match="tei:div3">
     <em> 
        <xsl:text>Folio </xsl:text>
     <xsl:value-of select="@n"/>
         <xsl:text>: </xsl:text>
    </em>
     <p/>
     <xsl:apply-templates/>
 </xsl:template>

 <!-- Labels Spanish and Nahuatl head sections -->   
 <xsl:template match="tei:div4/tei:head[@xml:lang='sp']">
     <xsl:text>(Spanish): 
     </xsl:text>
     <xsl:apply-templates/>
 </xsl:template>
    
<xsl:template match="tei:div4/tei:head[@xml:lang='na']" >
    <xsl:text>(Nahuatl): 
    </xsl:text>
    <xsl:apply-templates/>
</xsl:template>
    
<!-- This breaks the text into paragraphs as marked up in text (not the same as pages) -->
    <xsl:template match="tei:p">
        <p><xsl:apply-templates/></p>
    </xsl:template>

<!-- This hides the expanded words at the letter level -->
<xsl:template match="tei:ex"/>
    
    
<!-- This hides the original spelling -->
<xsl:template match="tei:choice/tei:orig"/>
    
<!-- This turns lb's into br's -->    
<xsl:template match="tei:lb">
    <br/><xsl:apply-templates/>
</xsl:template>

<xsl:template match="tei:item">
    <br />
    <xsl:apply-templates/>
</xsl:template>    
</xsl:stylesheet>

