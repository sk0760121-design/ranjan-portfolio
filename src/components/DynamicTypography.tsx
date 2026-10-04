import React, { useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { generateGoogleFontsUrl, getFontFallbackStack } from '../lib/fonts';
import { TypographyRule } from '../types/database';

export const DynamicTypography: React.FC = () => {
  const { settings, customFonts } = useCMS();
  const typo = settings.theme.typography;

  // Extract all font families used
  const usedFamilies = React.useMemo(() => {
    const list = [
      typo.globalBody?.fontFamily,
      typo.heading?.fontFamily,
      typo.heroHeading?.fontFamily,
      typo.heroSubtitle?.fontFamily,
      typo.navigation?.fontFamily,
      typo.sectionHeading?.fontFamily,
      typo.projectTitle?.fontFamily,
      typo.projectDescription?.fontFamily,
      typo.button?.fontFamily,
      typo.footer?.fontFamily,
      typo.h1?.fontFamily,
      typo.h2?.fontFamily,
      typo.body?.fontFamily,
    ].filter(Boolean) as string[];

    return Array.from(new Set(list));
  }, [typo]);

  // Dynamically load Google Fonts stylesheet only for selected fonts
  useEffect(() => {
    const googleFontUrl = generateGoogleFontsUrl(usedFamilies);
    let linkTag = document.getElementById('dynamic-google-fonts') as HTMLLinkElement | null;

    if (!googleFontUrl) {
      if (linkTag) linkTag.remove();
      return;
    }

    if (!linkTag) {
      linkTag = document.createElement('link');
      linkTag.id = 'dynamic-google-fonts';
      linkTag.rel = 'stylesheet';
      document.head.appendChild(linkTag);
    }

    if (linkTag.href !== googleFontUrl) {
      linkTag.href = googleFontUrl;
    }
  }, [usedFamilies]);

  // Generate CSS style rules
  const cssStyles = React.useMemo(() => {
    // 1. @font-face rules for active custom uploaded fonts
    const fontFaceRules = customFonts
      .filter((f) => f.active && f.file_url)
      .map((f) => {
        return `
          @font-face {
            font-family: '${f.family_name}';
            src: url('${f.file_url}') format('${f.format}');
            font-weight: ${f.weight || 'normal'};
            font-style: ${f.style || 'normal'};
            font-display: swap;
          }
        `;
      })
      .join('\n');

    // Helper for CSS var values with fallback
    const getStack = (rule?: TypographyRule, defaultFamily = 'Plus Jakarta Sans') => {
      const family = rule?.fontFamily || defaultFamily;
      return getFontFallbackStack(family, customFonts);
    };

    const globalBodyStack = getStack(typo.globalBody, 'Plus Jakarta Sans');
    const headingStack = getStack(typo.heading || typo.h2, 'Syne');
    const heroHeadingStack = getStack(typo.heroHeading || typo.h1, 'Syne');
    const heroSubtitleStack = getStack(typo.heroSubtitle, 'Plus Jakarta Sans');
    const navigationStack = getStack(typo.navigation, 'Plus Jakarta Sans');
    const sectionHeadingStack = getStack(typo.sectionHeading || typo.h2, 'Syne');
    const projectTitleStack = getStack(typo.projectTitle, 'Syne');
    const projectDescStack = getStack(typo.projectDescription, 'Plus Jakarta Sans');
    const buttonStack = getStack(typo.button, 'Plus Jakarta Sans');
    const footerStack = getStack(typo.footer, 'Plus Jakarta Sans');

    return `
      ${fontFaceRules}

      :root {
        --font-global-body: ${globalBodyStack};
        --font-heading: ${headingStack};
        --font-hero-heading: ${heroHeadingStack};
        --font-hero-subtitle: ${heroSubtitleStack};
        --font-navigation: ${navigationStack};
        --font-section-heading: ${sectionHeadingStack};
        --font-project-title: ${projectTitleStack};
        --font-project-desc: ${projectDescStack};
        --font-button: ${buttonStack};
        --font-footer: ${footerStack};

        /* Direct mappings for standard tags */
        --font-sans: var(--font-global-body);
      }

      body {
        font-family: var(--font-global-body);
      }

      .font-hero-heading {
        font-family: var(--font-hero-heading);
        font-weight: ${typo.heroHeading?.fontWeight || typo.h1?.fontWeight || '800'};
        letter-spacing: ${typo.heroHeading?.letterSpacing || typo.h1?.letterSpacing || '-0.03em'};
        line-height: ${typo.heroHeading?.lineHeight || typo.h1?.lineHeight || '1.02'};
        text-transform: ${typo.heroHeading?.textTransform || 'uppercase'};
      }

      .font-hero-subtitle {
        font-family: var(--font-hero-subtitle);
        font-weight: ${typo.heroSubtitle?.fontWeight || '400'};
        letter-spacing: ${typo.heroSubtitle?.letterSpacing || '0'};
        line-height: ${typo.heroSubtitle?.lineHeight || '1.65'};
        text-transform: ${typo.heroSubtitle?.textTransform || 'none'};
      }

      .font-navigation {
        font-family: var(--font-navigation);
        font-weight: ${typo.navigation?.fontWeight || '600'};
        letter-spacing: ${typo.navigation?.letterSpacing || '0.1em'};
        line-height: ${typo.navigation?.lineHeight || '1'};
        text-transform: ${typo.navigation?.textTransform || 'uppercase'};
      }

      .font-section-heading {
        font-family: var(--font-section-heading);
        font-weight: ${typo.sectionHeading?.fontWeight || typo.h2?.fontWeight || '800'};
        letter-spacing: ${typo.sectionHeading?.letterSpacing || typo.h2?.letterSpacing || '-0.02em'};
        line-height: ${typo.sectionHeading?.lineHeight || typo.h2?.lineHeight || '1.1'};
        text-transform: ${typo.sectionHeading?.textTransform || 'uppercase'};
      }

      .font-project-title {
        font-family: var(--font-project-title);
        font-weight: ${typo.projectTitle?.fontWeight || '800'};
        letter-spacing: ${typo.projectTitle?.letterSpacing || '-0.01em'};
        line-height: ${typo.projectTitle?.lineHeight || '1.1'};
        text-transform: ${typo.projectTitle?.textTransform || 'uppercase'};
      }

      .font-project-desc {
        font-family: var(--font-project-desc);
        font-weight: ${typo.projectDescription?.fontWeight || '400'};
        letter-spacing: ${typo.projectDescription?.letterSpacing || '0'};
        line-height: ${typo.projectDescription?.lineHeight || '1.6'};
        text-transform: ${typo.projectDescription?.textTransform || 'none'};
      }

      .font-button {
        font-family: var(--font-button);
        font-weight: ${typo.button?.fontWeight || '600'};
        letter-spacing: ${typo.button?.letterSpacing || '0.04em'};
        line-height: ${typo.button?.lineHeight || '1'};
        text-transform: ${typo.button?.textTransform || 'uppercase'};
      }

      .font-footer {
        font-family: var(--font-footer);
        font-weight: ${typo.footer?.fontWeight || '400'};
        letter-spacing: ${typo.footer?.letterSpacing || '0'};
        line-height: ${typo.footer?.lineHeight || '1.5'};
        text-transform: ${typo.footer?.textTransform || 'none'};
      }

      /* Responsive Font Size Clamps */
      h1, .hero-title-text {
        font-size: clamp(
          ${typo.heroHeading?.fontSizeMobile || typo.h1?.fontSizeMobile || '36px'},
          7vw,
          ${typo.heroHeading?.fontSizeDesktop || typo.h1?.fontSizeDesktop || '84px'}
        );
      }

      h2, .section-heading-text {
        font-size: clamp(
          ${typo.sectionHeading?.fontSizeMobile || typo.h2?.fontSizeMobile || '28px'},
          5vw,
          ${typo.sectionHeading?.fontSizeDesktop || typo.h2?.fontSizeDesktop || '52px'}
        );
      }

      .hero-subtitle-text {
        font-size: clamp(
          ${typo.heroSubtitle?.fontSizeMobile || '15px'},
          1.8vw,
          ${typo.heroSubtitle?.fontSizeDesktop || '18px'}
        );
      }

      .project-title-text {
        font-size: clamp(
          ${typo.projectTitle?.fontSizeMobile || '18px'},
          2.5vw,
          ${typo.projectTitle?.fontSizeDesktop || '24px'}
        );
      }

      .project-desc-text {
        font-size: clamp(
          ${typo.projectDescription?.fontSizeMobile || '13px'},
          1.5vw,
          ${typo.projectDescription?.fontSizeDesktop || '15px'}
        );
      }

      .nav-link-text {
        font-size: ${typo.navigation?.fontSizeDesktop || '12px'};
      }

      .btn-text {
        font-size: clamp(
          ${typo.button?.fontSizeMobile || '13px'},
          1.5vw,
          ${typo.button?.fontSizeDesktop || '14px'}
        );
      }
    `;
  }, [typo, customFonts]);

  return <style id="dynamic-typography-styles" dangerouslySetInnerHTML={{ __html: cssStyles }} />;
};
