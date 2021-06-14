<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:tei="http://www.tei-c.org/ns/1.0" xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs tei" 
    version="2.0">
    
    <xsl:output omit-xml-declaration="yes" method="text" encoding="UTF-8"/>
    <xsl:strip-space elements="*"/>
   
    <!-- script for converting XML-TEI to HTML. 		
	Laura Mandell on 05/27/18 
	00-this is the original file 	
-->
    
    <!-- to recurse through the XML directory and grab all the files, use this code. The xslt and dirList must both
        be located in the xslt folder for this to work, unless you change some of the information below -->
    
        <xsl:template match="list">
        <xsl:for-each select="item">
            <xsl:for-each select="collection(iri-to-uri(concat(@dir, '?select=*.xml')))">
                <xsl:variable name="outpath"
                    select="concat('../text/', substring-before(tokenize(document-uri(.), '/')[last()], '.xml'))"/>
                <xsl:result-document href="{concat($outpath, '.txt')}">
                    <xsl:apply-templates select="tei:TEI"/>
                </xsl:result-document>
            </xsl:for-each>
        </xsl:for-each>
    </xsl:template>

    
    <xsl:template match="tei:teiHeader"/>
    
    <xsl:template match="*">
        <xsl:apply-templates/>
        <xsl:text> </xsl:text>
    </xsl:template>

<!-- 'tokenize' removes punctuation; remove the tokenize function if you want punctuation in text -->
    <xsl:template match="text()">
        <xsl:value-of select="tokenize(., '\W')"/>
    </xsl:template>
   
</xsl:stylesheet>