#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de correction d'encodage UTF-8
=====================================

Ce script corrige les problèmes d'encodage UTF-8 couramment rencontrés lors du 
transfert de données entre systèmes avec des paramètres d'encodage différents.

Problèmes corrigés :
- Double encodage UTF-8 (caractères affichés comme Ã© au lieu de é)
- Caractères mal formés (č± au lieu de ı, č‡ au lieu de ć)
- Séquences d'échappement incorrectes
- Caractères de contrôle indésirables

Usage :
    python3 fix-utf8-encoding.py <fichier_source> [fichier_destination]

Si aucun fichier de destination n'est spécifié, le fichier source sera modifié.
"""

import sys
import re
import unicodedata
from pathlib import Path

class UTF8EncodingFixer:
    """
    Classe utilitaire pour corriger les problèmes d'encodage UTF-8
    """
    
    def __init__(self):
        # Mapping des caractères mal encodés vers leurs équivalents corrects
        self.common_fixes = {
            # Caractères accentués de base (minuscules)
            'Ã©': 'é', 'Ã¨': 'è', 'Ãª': 'ê', 'Ã«': 'ë',
            'Ã¡': 'á', 'Ã ': 'à', 'Ã¢': 'â', 'Ã£': 'ã', 'Ã¤': 'ä', 'Ã¥': 'å',
            'Ã­': 'í', 'Ã¬': 'ì', 'Ã®': 'î', 'Ã¯': 'ï',
            'Ã³': 'ó', 'Ã²': 'ò', 'Ã´': 'ô', 'Ãµ': 'õ', 'Ã¶': 'ö',
            'Ãº': 'ú', 'Ã¹': 'ù', 'Ã»': 'û', 'Ã¼': 'ü',
            'Ã½': 'ý', 'Ã¿': 'ÿ',
            'Ã±': 'ñ', 'Ã§': 'ç',
            
            # Caractères majuscules
            'Ã‰': 'É', 'Ãˆ': 'È', 'ÃŠ': 'Ê', 'Ã‹': 'Ë',
            'Ã€': 'À', 'Ã‚': 'Â', 'Ãƒ': 'Ã', 'Ã„': 'Ä', 'Ã…': 'Å',
            'ÃŒ': 'Ì', 'ÃŽ': 'Î',
            'Ã"': 'Ó', 'Ã"': 'Ô', 'Ã•': 'Õ', 'Ã–': 'Ö',
            'Ãš': 'Ú', 'Ã™': 'Ù', 'Ã›': 'Û', 'Ãœ': 'Ü',
            'Ã‡': 'Ç',
            
            # Caractères nordiques et baltes
            'Ã¸': 'ø', 'Ã˜': 'Ø',
            'Ã¦': 'æ', 'Ã†': 'Æ',
            'Ã°': 'ð',
            
            # Caractères d'Europe de l'Est et turcs
            'Ä‡': 'ć', 'Ä†': 'Ć',
            'Ä±': 'ı', 'Ä°': 'İ',
            'Å‚': 'ł',
            'Å„': 'ń', 'Åƒ': 'Ń', 
            'Å¡': 'š', 'Å ': 'Š',
            'Å¾': 'ž', 'Å½': 'Ž',
            
            # Problèmes spécifiques observés dans le dataset
            'Bayč±ndč±r': 'Bayındır',
            'Lukič‡': 'Lukić',
            'č±': 'ı',
            'č‡': 'ć',
            'ndč±r': 'ndır',
            
        }
        
        # Expressions régulières pour détecter des patterns d'encodage incorrects
        self.regex_patterns = [
            # Séquences UTF-8 mal décodées (caractères après Ã)
            (re.compile(r'Ã.'), self._fix_utf8_sequence),
            # Caractères de contrôle indésirables
            (re.compile(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]'), ''),
            # Espaces insécables mal encodés
            (re.compile(r'Â '), ' '),
            # Points d'interrogation en losange (caractères non reconnus)
            (re.compile(r'�'), ''),
        ]
    
    def _fix_utf8_sequence(self, match):
        """
        Tente de corriger une séquence UTF-8 mal décodée
        """
        sequence = match.group(0)
        if sequence in self.common_fixes:
            return self.common_fixes[sequence]
        
        # Essaye de décoder la séquence comme du latin1 puis de l'encoder en UTF-8
        try:
            return sequence.encode('latin1').decode('utf-8')
        except (UnicodeEncodeError, UnicodeDecodeError):
            return sequence
    
    def fix_double_encoding(self, text):
        """
        Corrige le double encodage UTF-8 en traitant le texte comme du latin1
        puis en le réencodant correctement en UTF-8
        """
        try:
            # Encode en latin1 puis décode en UTF-8
            return text.encode('latin1').decode('utf-8')
        except (UnicodeEncodeError, UnicodeDecodeError):
            return text
    
    def normalize_unicode(self, text):
        """
        Normalise les caractères Unicode en utilisant la forme canonique NFC
        """
        return unicodedata.normalize('NFC', text)
    
    def fix_text(self, text):
        """
        Applique toutes les corrections d'encodage au texte donné
        """
        # Étape 1: Corrections directes des caractères mal encodés
        for wrong, correct in self.common_fixes.items():
            text = text.replace(wrong, correct)
        
        # Étape 2: Application des patterns regex
        for pattern, replacement in self.regex_patterns:
            if callable(replacement):
                text = pattern.sub(replacement, text)
            else:
                text = pattern.sub(replacement, text)
        
        # Étape 3: Tentative de correction du double encodage
        try:
            if any(char in text for char in ['Ã', 'â€', 'Â']):
                fixed_text = self.fix_double_encoding(text)
                # Vérifie si la correction a amélioré le texte
                if len(fixed_text) <= len(text) and not any(char in fixed_text for char in ['Ã', 'â€']):
                    text = fixed_text
        except:
            pass
        
        # Étape 4: Normalisation Unicode
        text = self.normalize_unicode(text)
        
        return text
    
    def fix_file(self, input_file, output_file=None):
        """
        Corrige l'encodage d'un fichier entier
        """
        if output_file is None:
            output_file = input_file
        
        input_path = Path(input_file)
        output_path = Path(output_file)
        
        if not input_path.exists():
            raise FileNotFoundError(f"Le fichier {input_file} n'existe pas")
        
        # Essaye plusieurs encodages pour lire le fichier
        encodings = ['utf-8', 'latin1', 'cp1252', 'iso-8859-1']
        content = None
        used_encoding = None
        
        for encoding in encodings:
            try:
                with open(input_path, 'r', encoding=encoding, errors='replace') as f:
                    content = f.read()
                used_encoding = encoding
                break
            except UnicodeDecodeError:
                continue
        
        if content is None:
            raise RuntimeError("Impossible de lire le fichier avec les encodages supportés")
        
        print(f"Fichier lu avec l'encodage: {used_encoding}")
        
        # Applique les corrections
        fixed_content = self.fix_text(content)
        
        # Écrit le fichier corrigé en UTF-8
        with open(output_path, 'w', encoding='utf-8', newline='') as f:
            f.write(fixed_content)
        
        print(f"Fichier corrigé sauvegardé: {output_file}")
        
        # Statistiques
        original_problems = sum(1 for char in content if ord(char) > 127 and char in self.common_fixes)
        remaining_problems = sum(1 for char in fixed_content if ord(char) > 127 and char in self.common_fixes)
        
        print(f"Caractères problématiques corrigés: {original_problems - remaining_problems}")
        if remaining_problems > 0:
            print(f"Caractères problématiques restants: {remaining_problems}")

def main():
    """
    Fonction principale du script
    """
    if len(sys.argv) < 2:
        print(__doc__)
        print("\nUsage: python3 fix-utf8-encoding.py <fichier_source> [fichier_destination]")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else input_file
    
    fixer = UTF8EncodingFixer()
    
    try:
        fixer.fix_file(input_file, output_file)
        print("✅ Correction terminée avec succès!")
    except Exception as e:
        print(f"❌ Erreur: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
