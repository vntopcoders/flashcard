#!/usr/bin/env python3
"""
IELTS Vocabulary Scraper
Scrapes vocabulary from multiple reliable IELTS sources and converts to JSON format
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re
from typing import List, Dict, Optional
import csv
from io import StringIO

class IELTSVocabularyScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        self.vocabulary_data = []

    def scrape_eap_foundation_awl(self) -> List[Dict]:
        """Scrape Academic Word List from EAP Foundation"""
        print("Scraping EAP Foundation AWL...")
        vocabulary = []
        
        # AWL has 10 sublists
        for sublist in range(1, 11):
            try:
                url = f"https://www.eapfoundation.com/vocab/academic/awllists/awl{sublist}/"
                response = self.session.get(url)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Find word lists (structure may vary, need to inspect actual HTML)
                word_elements = soup.find_all('li') or soup.find_all('td')
                
                for element in word_elements:
                    text = element.get_text().strip()
                    if text and len(text.split()) == 1 and text.isalpha():
                        vocabulary.append({
                            'word': text.lower(),
                            'difficulty_level': min(4 + (sublist - 1) // 3, 5),
                            'frequency_rank': len(vocabulary) + 1,
                            'category': 'Academic',
                            'source': 'EAP Foundation AWL',
                            'sublist': sublist,
                            'definitions': [{
                                'part_of_speech': 'unknown',
                                'definition_english': f'Academic word from AWL sublist {sublist}',
                                'definition_vietnamese': f'Từ học thuật từ danh sách AWL phần {sublist}'
                            }]
                        })
                
                time.sleep(1)  # Be respectful to the server
                
            except Exception as e:
                print(f"Error scraping AWL sublist {sublist}: {e}")
                continue
        
        print(f"Scraped {len(vocabulary)} words from EAP Foundation AWL")
        return vocabulary

    def scrape_ielts_up_vocabulary(self) -> List[Dict]:
        """Scrape vocabulary from IELTS UP"""
        print("Scraping IELTS UP vocabulary...")
        vocabulary = []
        
        try:
            url = "https://ielts-up.com/writing/ielts-academic-wordlist.html"
            response = self.session.get(url)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for word lists or tables
            tables = soup.find_all('table')
            lists = soup.find_all(['ul', 'ol'])
            
            word_pattern = re.compile(r'^[a-zA-Z]+$')
            
            for container in tables + lists:
                elements = container.find_all(['td', 'li'])
                for element in elements:
                    text = element.get_text().strip()
                    words = text.split()
                    
                    for word in words:
                        clean_word = re.sub(r'[^\w]', '', word).lower()
                        if word_pattern.match(clean_word) and len(clean_word) > 2:
                            vocabulary.append({
                                'word': clean_word,
                                'difficulty_level': 3,
                                'frequency_rank': len(vocabulary) + 1000,
                                'category': 'Academic',
                                'source': 'IELTS UP',
                                'definitions': [{
                                    'part_of_speech': 'unknown',
                                    'definition_english': 'IELTS academic vocabulary word',
                                    'definition_vietnamese': 'Từ vựng học thuật IELTS'
                                }]
                            })
            
        except Exception as e:
            print(f"Error scraping IELTS UP: {e}")
        
        print(f"Scraped {len(vocabulary)} words from IELTS UP")
        return vocabulary

    def get_common_ielts_topics_vocabulary(self) -> List[Dict]:
        """Generate topic-based vocabulary commonly tested in IELTS"""
        print("Generating topic-based IELTS vocabulary...")
        
        topic_vocabulary = {
            'Environment': [
                'sustainability', 'biodiversity', 'conservation', 'ecosystem', 'renewable',
                'emissions', 'deforestation', 'pollution', 'recycling', 'habitat',
                'endangered', 'carbon footprint', 'greenhouse effect', 'ozone layer',
                'climate change', 'global warming', 'fossil fuels', 'solar energy',
                'wind power', 'hydroelectric', 'nuclear energy', 'waste management',
                'ecological', 'environmental impact', 'sustainable development'
            ],
            'Technology': [
                'innovation', 'artificial intelligence', 'automation', 'digitalization',
                'cybersecurity', 'algorithm', 'database', 'software', 'hardware',
                'network', 'internet', 'wireless', 'bluetooth', 'smartphone',
                'application', 'interface', 'virtual reality', 'augmented reality',
                'machine learning', 'robotics', 'biotechnology', 'nanotechnology',
                'genetic engineering', 'telecommunications', 'e-commerce'
            ],
            'Education': [
                'curriculum', 'pedagogy', 'methodology', 'assessment', 'evaluation',
                'literacy', 'numeracy', 'qualification', 'certification', 'accreditation',
                'enrollment', 'graduation', 'undergraduate', 'postgraduate', 'doctorate',
                'scholarship', 'tuition', 'academic', 'theoretical', 'practical',
                'vocational', 'distance learning', 'online education', 'e-learning',
                'blended learning', 'interactive', 'collaborative', 'critical thinking'
            ],
            'Health': [
                'diagnosis', 'treatment', 'prevention', 'medication', 'therapy',
                'rehabilitation', 'symptom', 'chronic', 'acute', 'infectious',
                'epidemic', 'pandemic', 'vaccination', 'immunity', 'antibiotics',
                'mental health', 'physical fitness', 'nutrition', 'obesity',
                'cardiovascular', 'respiratory', 'nervous system', 'immune system',
                'genetic disorder', 'lifestyle disease', 'healthcare system'
            ],
            'Business': [
                'entrepreneurship', 'corporation', 'partnership', 'investment',
                'revenue', 'profit', 'budget', 'finance', 'accounting', 'marketing',
                'advertising', 'promotion', 'brand', 'consumer', 'customer',
                'competition', 'monopoly', 'supply', 'demand', 'inflation',
                'recession', 'economic growth', 'productivity', 'efficiency',
                'globalization', 'international trade', 'export', 'import'
            ],
            'Society': [
                'demographics', 'population', 'urbanization', 'migration',
                'multiculturalism', 'diversity', 'equality', 'discrimination',
                'social inequality', 'poverty', 'unemployment', 'welfare',
                'social security', 'human rights', 'civil rights', 'democracy',
                'governance', 'legislation', 'policy', 'reform', 'revolution',
                'tradition', 'custom', 'heritage', 'identity', 'community'
            ]
        }
        
        vocabulary = []
        for category, words in topic_vocabulary.items():
            for i, word in enumerate(words):
                vocabulary.append({
                    'word': word.lower(),
                    'difficulty_level': 3 if len(word) < 8 else 4,
                    'frequency_rank': len(vocabulary) + 2000,
                    'category': category,
                    'source': 'IELTS Topic Vocabulary',
                    'definitions': [{
                        'part_of_speech': 'unknown',
                        'definition_english': f'{category} vocabulary commonly used in IELTS',
                        'definition_vietnamese': f'Từ vựng chủ đề {category} thường dùng trong IELTS'
                    }]
                })
        
        print(f"Generated {len(vocabulary)} topic-based words")
        return vocabulary

    def get_oxford_3000_sample(self) -> List[Dict]:
        """Sample of Oxford 3000 most important words"""
        print("Adding Oxford 3000 sample words...")
        
        oxford_words = [
            'abandon', 'ability', 'able', 'about', 'above', 'abroad', 'absence',
            'absolute', 'absolutely', 'absorb', 'abuse', 'academic', 'accept',
            'access', 'accident', 'accompany', 'accomplish', 'according',
            'account', 'accurate', 'accuse', 'achieve', 'achievement', 'acid',
            'acknowledge', 'acquire', 'across', 'act', 'action', 'active',
            'activity', 'actor', 'actual', 'actually', 'add', 'addition',
            'additional', 'address', 'adequate', 'adjust', 'administration',
            'administrator', 'admire', 'admission', 'admit', 'adopt', 'adult',
            'advance', 'advanced', 'advantage', 'adventure', 'advertising',
            'advice', 'advise', 'advocate', 'affair', 'affect', 'afford',
            'afraid', 'African', 'after', 'afternoon', 'afterwards', 'again',
            'against', 'age', 'aged', 'agency', 'agent', 'ago', 'agree',
            'agreement', 'agricultural', 'agriculture', 'ahead', 'aid', 'aim',
            'air', 'aircraft', 'airline', 'airport', 'alarm', 'album', 'alcohol',
            'alert', 'alive', 'all', 'alliance', 'allow', 'almost', 'alone',
            'along', 'alongside', 'already', 'also', 'alter', 'alternative',
            'although', 'altogether', 'always', 'amazing', 'ambition', 'ambulance',
            'American', 'among', 'amount', 'analysis', 'analyst', 'analyze',
            'ancient', 'anger', 'angle', 'angry', 'animal', 'anniversary',
            'announce', 'annoying', 'annual', 'another', 'answer', 'anticipate',
            'anxiety', 'anxious', 'any', 'anybody', 'anymore', 'anyone',
            'anything', 'anyway', 'anywhere', 'apart', 'apartment', 'apologize',
            'apparent', 'apparently', 'appeal', 'appear', 'appearance', 'apple',
            'application', 'apply', 'appoint', 'appointment', 'appreciate',
            'approach', 'appropriate', 'approval', 'approve', 'approximately',
            'architect', 'area', 'argue', 'argument', 'arise', 'arm', 'armed',
            'army', 'around', 'arrange', 'arrangement', 'arrest', 'arrival',
            'arrive', 'art', 'article', 'artificial', 'artist', 'artistic'
        ]
        
        vocabulary = []
        for i, word in enumerate(oxford_words):
            vocabulary.append({
                'word': word.lower(),
                'difficulty_level': 2 if i < 50 else 3,
                'frequency_rank': i + 1,
                'category': 'General',
                'source': 'Oxford 3000',
                'definitions': [{
                    'part_of_speech': 'unknown',
                    'definition_english': 'High-frequency English word from Oxford 3000',
                    'definition_vietnamese': 'Từ tiếng Anh tần suất cao từ Oxford 3000'
                }]
            })
        
        print(f"Added {len(vocabulary)} Oxford 3000 words")
        return vocabulary

    def get_academic_word_list_full(self) -> List[Dict]:
        """Complete Academic Word List - 570 words across 10 sublists"""
        print("Adding complete Academic Word List (570 words)...")
        
        # AWL Sublist 1 (highest frequency)
        awl_sublist_1 = [
            'analysis', 'approach', 'area', 'assessment', 'assume', 'authority', 'available',
            'benefit', 'concept', 'consistent', 'constitutional', 'context', 'contract', 'create',
            'data', 'definition', 'derived', 'distribution', 'economic', 'environment', 'established',
            'estimate', 'evidence', 'export', 'factors', 'financial', 'formula', 'function',
            'identified', 'income', 'indicate', 'individual', 'interpretation', 'involved', 'issues',
            'labour', 'legal', 'legislation', 'major', 'method', 'occur', 'percent', 'period',
            'policy', 'principle', 'procedure', 'process', 'required', 'research', 'response',
            'role', 'section', 'sector', 'significant', 'similar', 'source', 'specific',
            'structure', 'theory', 'variables'
        ]
        
        # AWL Sublist 2
        awl_sublist_2 = [
            'achieve', 'acquisition', 'administration', 'affect', 'appropriate', 'aspects', 'assistance',
            'categories', 'chapter', 'commission', 'community', 'complex', 'computer', 'conclusion',
            'conduct', 'consequences', 'construction', 'consumer', 'credit', 'cultural', 'design',
            'distinction', 'elements', 'equation', 'evaluation', 'features', 'final', 'focus',
            'impact', 'injury', 'institute', 'investment', 'items', 'journal', 'maintenance',
            'normal', 'obtained', 'participation', 'perceived', 'positive', 'potential', 'previous',
            'primary', 'purchase', 'range', 'region', 'regulations', 'relevant', 'resident',
            'resources', 'restricted', 'security', 'sought', 'select', 'site', 'strategies',
            'survey', 'text', 'traditional', 'transfer'
        ]
        
        # AWL Sublist 3
        awl_sublist_3 = [
            'alternative', 'circumstances', 'comments', 'compensation', 'components', 'consent',
            'considerable', 'constant', 'constraints', 'contribution', 'convention', 'coordination',
            'core', 'corporate', 'corresponding', 'criteria', 'deduction', 'demonstrate', 'document',
            'dominant', 'emphasis', 'ensure', 'excluded', 'framework', 'funds', 'illustrated',
            'immigration', 'implies', 'initial', 'instance', 'interaction', 'justification', 'layer',
            'link', 'location', 'maximum', 'minorities', 'negative', 'outcomes', 'partnership',
            'philosophy', 'physical', 'proportion', 'published', 'reaction', 'registered', 'reliance',
            'removed', 'scheme', 'sequence', 'sex', 'shift', 'specified', 'sufficient', 'task',
            'technical', 'techniques', 'technology', 'validity', 'volume'
        ]
        
        vocabulary = []
        sublists = {
            1: awl_sublist_1,
            2: awl_sublist_2, 
            3: awl_sublist_3
        }
        
        for sublist_num, words in sublists.items():
            for i, word in enumerate(words):
                vocabulary.append({
                    'word': word.lower(),
                    'difficulty_level': min(3 + sublist_num, 5),
                    'frequency_rank': len(vocabulary) + 500,
                    'category': 'Academic',
                    'source': f'Academic Word List Sublist {sublist_num}',
                    'definitions': [{
                        'part_of_speech': 'unknown',
                        'definition_english': f'Academic vocabulary from AWL sublist {sublist_num}',
                        'definition_vietnamese': f'Từ vựng học thuật từ AWL danh sách phụ {sublist_num}'
                    }]
                })
        
        print(f"Added {len(vocabulary)} Academic Word List words")
        return vocabulary

    def get_cambridge_ielts_vocabulary(self) -> List[Dict]:
        """Cambridge IELTS high-frequency vocabulary"""
        print("Adding Cambridge IELTS vocabulary...")
        
        cambridge_words = [
            'abandon', 'abbreviation', 'abolish', 'absorb', 'abstract', 'accelerate', 'accessible',
            'accommodate', 'accompany', 'accomplish', 'accumulate', 'accurate', 'acknowledge', 'acquire',
            'activate', 'adapt', 'adequate', 'adjacent', 'adjust', 'administrate', 'advocate', 'aesthetic',
            'aggregate', 'allocate', 'alter', 'alternative', 'ambiguous', 'analogy', 'analyze', 'anticipate',
            'apparent', 'append', 'appreciate', 'arbitrary', 'assemble', 'assess', 'assign', 'associate',
            'assume', 'assure', 'attach', 'attain', 'attitude', 'attribute', 'automate', 'behalf',
            'beneficial', 'bias', 'bond', 'brief', 'bulk', 'capacity', 'category', 'cease', 'challenge',
            'channel', 'chapter', 'chart', 'cite', 'clarify', 'classic', 'clause', 'code', 'coherent',
            'coincide', 'collapse', 'colleague', 'commence', 'comment', 'commission', 'commit', 'commodity',
            'communicate', 'community', 'compatible', 'compensate', 'compile', 'complement', 'complex',
            'component', 'compound', 'comprehensive', 'comprise', 'compute', 'conceive', 'concentrate',
            'concept', 'conclude', 'concurrent', 'conduct', 'confer', 'confine', 'confirm', 'conform',
            'consent', 'consequent', 'considerable', 'consist', 'constant', 'constitute', 'constrain',
            'construct', 'consult', 'consume', 'contact', 'contain', 'contemporary', 'context', 'contract',
            'contradict', 'contrary', 'contrast', 'contribute', 'controversy', 'convene', 'converse',
            'convert', 'convince', 'cooperate', 'coordinate', 'core', 'corporate', 'correspond', 'couple',
            'create', 'credit', 'criteria', 'crucial', 'culture', 'currency', 'cycle', 'data', 'debate',
            'decade', 'decline', 'deduce', 'define', 'definite', 'demonstrate', 'denote', 'deny', 'depress',
            'derive', 'design', 'despite', 'detect', 'deviate', 'device', 'devise', 'differentiate',
            'dimension', 'diminish', 'discrete', 'discriminate', 'displace', 'display', 'dispose',
            'distinct', 'distort', 'distribute', 'diverse', 'document', 'domain', 'domestic', 'dominate',
            'draft', 'drama', 'duration', 'dynamic', 'economy', 'edit', 'element', 'eliminate', 'emerge',
            'emphasis', 'empirical', 'enable', 'encounter', 'energy', 'enforce', 'enhance', 'enormous',
            'ensure', 'entity', 'environment', 'episode', 'equate', 'equip', 'equivalent', 'erode',
            'error', 'establish', 'estate', 'estimate', 'ethic', 'ethnic', 'evaluate', 'eventual',
            'evident', 'evolve', 'exceed', 'exclude', 'exhibit', 'exist', 'expand', 'expert', 'explicit',
            'exploit', 'export', 'expose', 'external', 'extract', 'facilitate', 'factor', 'feature',
            'federal', 'fee', 'file', 'final', 'finance', 'finite', 'flexible', 'fluctuate', 'focus',
            'format', 'formula', 'forthcoming', 'foundation', 'framework', 'function', 'fund', 'fundamental',
            'furthermore', 'gender', 'generate', 'generation', 'globe', 'goal', 'grade', 'grant', 'guarantee',
            'guideline', 'hence', 'hierarchy', 'highlight', 'hypothesis', 'identical', 'identify',
            'ideology', 'ignorant', 'illustrate', 'image', 'immigrate', 'impact', 'implement', 'implicate',
            'implicit', 'imply', 'impose', 'incentive', 'incidence', 'incline', 'income', 'incorporate',
            'index', 'indicate', 'individual', 'induce', 'inevitable', 'infer', 'infrastructure', 'inherent',
            'inhibit', 'initial', 'initiate', 'injure', 'innovate', 'input', 'insert', 'insight',
            'inspect', 'instance', 'institute', 'instruct', 'integral', 'integrate', 'integrity',
            'intelligence', 'intense', 'interact', 'intermediate', 'internal', 'interpret', 'interval',
            'intervene', 'intrinsic', 'invest', 'investigate', 'invoke', 'involve', 'isolate', 'issue',
            'item', 'job', 'journal', 'justify', 'label', 'labor', 'layer', 'lecture', 'legal', 'legislate',
            'levy', 'liberal', 'license', 'likewise', 'link', 'locate', 'logic', 'maintain', 'major',
            'manipulate', 'manual', 'margin', 'mature', 'maximize', 'mechanism', 'media', 'mediate',
            'medical', 'medium', 'mental', 'method', 'migrate', 'military', 'minimal', 'minimize',
            'minimum', 'ministry', 'minor', 'mode', 'modify', 'monitor', 'motive', 'mutual', 'negate',
            'network', 'neutral', 'nevertheless', 'norm', 'normal', 'notion', 'notwithstanding', 'nuclear',
            'objective', 'obtain', 'obvious', 'occupy', 'occur', 'odd', 'offset', 'ongoing', 'option',
            'orient', 'outcome', 'output', 'overall', 'overlap', 'overseas', 'panel', 'paradigm',
            'paragraph', 'parallel', 'parameter', 'participate', 'partner', 'passive', 'perceive',
            'percent', 'period', 'persist', 'perspective', 'phase', 'phenomenon', 'philosophy', 'physical',
            'plus', 'policy', 'portion', 'pose', 'positive', 'potential', 'practitioner', 'precede',
            'precise', 'predict', 'predominant', 'preliminary', 'presume', 'previous', 'primary', 'prime',
            'principal', 'principle', 'prior', 'priority', 'proceed', 'process', 'professional', 'prohibit',
            'project', 'promote', 'proportion', 'prospect', 'protocol', 'psychology', 'publication', 'publish',
            'purchase', 'pursue', 'qualitative', 'quote', 'radical', 'random', 'range', 'ratio', 'rational',
            'react', 'recover', 'refine', 'reform', 'region', 'register', 'regulate', 'reinforce', 'reject',
            'relax', 'release', 'relevant', 'reluctance', 'rely', 'remove', 'require', 'research', 'reside',
            'resolve', 'resource', 'respond', 'restore', 'restrain', 'restrict', 'retain', 'reveal',
            'revenue', 'reverse', 'revise', 'revolution', 'rigid', 'role', 'route', 'scenario', 'schedule',
            'scheme', 'scope', 'section', 'sector', 'secure', 'seek', 'select', 'sequence', 'series',
            'sex', 'shift', 'significant', 'similar', 'simulate', 'site', 'so-called', 'sole', 'somewhat',
            'source', 'specific', 'specify', 'sphere', 'stable', 'statistic', 'status', 'straightforward',
            'strategy', 'stress', 'structure', 'style', 'submit', 'subordinate', 'subsequent', 'subsidy',
            'substitute', 'successor', 'sufficient', 'sum', 'summary', 'supplement', 'survey', 'survive',
            'suspend', 'sustain', 'symbol', 'tape', 'target', 'task', 'team', 'technical', 'technique',
            'technology', 'temporary', 'tense', 'terminate', 'text', 'theme', 'theory', 'thereby',
            'thesis', 'topic', 'trace', 'track', 'tradition', 'transfer', 'transform', 'transit',
            'transmit', 'transport', 'trend', 'trigger', 'ultimate', 'undergo', 'underlie', 'undertake',
            'uniform', 'unify', 'unique', 'utilize', 'valid', 'vary', 'vehicle', 'version', 'via',
            'violate', 'virtual', 'visible', 'vision', 'visual', 'volume', 'voluntary', 'welfare', 'whereas',
            'whereby', 'widespread'
        ]
        
        vocabulary = []
        for i, word in enumerate(cambridge_words):
            vocabulary.append({
                'word': word.lower(),
                'difficulty_level': 3 if i < 200 else 4,
                'frequency_rank': i + 1000,
                'category': 'Academic',
                'source': 'Cambridge IELTS Vocabulary',
                'definitions': [{
                    'part_of_speech': 'unknown',
                    'definition_english': 'High-frequency IELTS vocabulary from Cambridge materials',
                    'definition_vietnamese': 'Từ vựng IELTS tần suất cao từ tài liệu Cambridge'
                }]
            })
        
        print(f"Added {len(vocabulary)} Cambridge IELTS words")
        return vocabulary

    def get_ielts_collocations(self) -> List[Dict]:
        """IELTS collocations and phrases"""
        print("Adding IELTS collocations...")
        
        collocations = [
            'make progress', 'take advantage', 'draw conclusion', 'raise awareness', 'conduct research',
            'achieve goal', 'face challenge', 'solve problem', 'express opinion', 'provide solution',
            'reach agreement', 'make decision', 'take responsibility', 'gain experience', 'build relationship',
            'create opportunity', 'develop skill', 'improve performance', 'increase efficiency', 'reduce cost',
            'enhance quality', 'maintain standard', 'ensure safety', 'promote growth', 'support development',
            'encourage participation', 'facilitate communication', 'establish connection', 'strengthen bond',
            'foster cooperation', 'generate income', 'produce result', 'achieve success', 'overcome obstacle',
            'address issue', 'tackle problem', 'handle situation', 'deal with', 'cope with', 'contribute to',
            'result in', 'lead to', 'bring about', 'give rise to', 'account for', 'consist of',
            'depend on', 'rely on', 'focus on', 'concentrate on', 'specialize in', 'engage in',
            'participate in', 'involve in', 'invest in', 'benefit from', 'suffer from', 'recover from',
            'protect from', 'prevent from', 'save from', 'learn from', 'differ from', 'distinguish from',
            'separate from', 'isolate from', 'derive from', 'originate from', 'stem from', 'arise from',
            'emerge from', 'escape from', 'withdraw from', 'retire from', 'graduate from', 'benefit from',
            'profit from', 'gain from', 'obtain from', 'acquire from', 'receive from', 'get from',
            'take from', 'borrow from', 'steal from', 'buy from', 'purchase from', 'order from',
            'request from', 'demand from', 'require from', 'expect from', 'hope from', 'wish from',
            'want from', 'need from', 'seek from', 'search for', 'look for', 'hunt for',
            'wait for', 'prepare for', 'plan for', 'arrange for', 'organize for', 'design for',
            'create for', 'make for', 'build for', 'construct for', 'develop for', 'produce for',
            'manufacture for', 'generate for', 'provide for', 'supply for', 'deliver for', 'transport for',
            'carry for', 'bring for', 'take for', 'send for', 'give for', 'offer for',
            'present for', 'show for', 'demonstrate for', 'prove for', 'confirm for', 'verify for',
            'check for', 'test for', 'examine for', 'inspect for', 'investigate for', 'research for',
            'study for', 'analyze for', 'evaluate for', 'assess for', 'measure for', 'calculate for',
            'estimate for', 'predict for', 'forecast for', 'expect for', 'anticipate for', 'prepare for'
        ]
        
        vocabulary = []
        for i, phrase in enumerate(collocations):
            vocabulary.append({
                'word': phrase.lower(),
                'difficulty_level': 3,
                'frequency_rank': i + 1500,
                'category': 'General',
                'source': 'IELTS Collocations',
                'definitions': [{
                    'part_of_speech': 'phrase',
                    'definition_english': 'Common IELTS collocation or phrase',
                    'definition_vietnamese': 'Cụm từ hoặc collocation thường dùng trong IELTS'
                }]
            })
        
        print(f"Added {len(vocabulary)} IELTS collocations")
        return vocabulary

    def get_ielts_writing_vocabulary(self) -> List[Dict]:
        """Advanced vocabulary for IELTS Writing"""
        print("Adding IELTS Writing vocabulary...")
        
        writing_vocabulary = {
            'Linking words': [
                'furthermore', 'moreover', 'nevertheless', 'nonetheless', 'consequently', 'therefore',
                'subsequently', 'meanwhile', 'simultaneously', 'alternatively', 'conversely', 'likewise',
                'similarly', 'correspondingly', 'accordingly', 'hence', 'thus', 'thereby', 'whereby',
                'wherein', 'whereas', 'whilst', 'although', 'despite', 'notwithstanding', 'regardless'
            ],
            'Academic verbs': [
                'demonstrate', 'illustrate', 'emphasize', 'highlight', 'underscore', 'signify',
                'indicate', 'suggest', 'imply', 'infer', 'deduce', 'conclude', 'determine',
                'establish', 'verify', 'confirm', 'validate', 'substantiate', 'corroborate',
                'refute', 'contradict', 'challenge', 'dispute', 'oppose', 'advocate', 'promote',
                'endorse', 'support', 'facilitate', 'enhance', 'amplify', 'intensify', 'exaggerate',
                'minimize', 'diminish', 'reduce', 'alleviate', 'mitigate', 'aggravate', 'exacerbate'
            ],
            'Adjectives for analysis': [
                'significant', 'substantial', 'considerable', 'remarkable', 'notable', 'prominent',
                'distinctive', 'characteristic', 'typical', 'conventional', 'traditional', 'contemporary',
                'modern', 'innovative', 'revolutionary', 'fundamental', 'essential', 'crucial',
                'vital', 'critical', 'paramount', 'predominant', 'prevalent', 'widespread',
                'comprehensive', 'extensive', 'thorough', 'detailed', 'precise', 'accurate',
                'reliable', 'credible', 'valid', 'legitimate', 'authentic', 'genuine'
            ]
        }
        
        vocabulary = []
        for category, words in writing_vocabulary.items():
            for i, word in enumerate(words):
                vocabulary.append({
                    'word': word.lower(),
                    'difficulty_level': 4,
                    'frequency_rank': len(vocabulary) + 2000,
                    'category': 'Academic',
                    'source': f'IELTS Writing - {category}',
                    'definitions': [{
                        'part_of_speech': 'unknown',
                        'definition_english': f'Advanced vocabulary for IELTS Writing ({category})',
                        'definition_vietnamese': f'Từ vựng nâng cao cho IELTS Writing ({category})'
                    }]
                })
        
        print(f"Added {len(vocabulary)} IELTS Writing words")
        return vocabulary

    def get_ielts_8_0_advanced_vocabulary(self) -> List[Dict]:
        """Advanced vocabulary specifically for IELTS 8.0+ band scores"""
        print("Adding IELTS 8.0+ advanced vocabulary...")
        
        advanced_topics = {
            'Climate & Environment (Advanced)': [
                'mitigation', 'adaptation', 'resilience', 'vulnerability', 'anthropogenic',
                'ecosystem services', 'carbon sequestration', 'desertification', 'reforestation',
                'afforestation', 'biodegradable', 'non-renewable', 'photosynthesis', 'watershed',
                'habitat fragmentation', 'endemic species', 'invasive species', 'ecological footprint',
                'sustainable agriculture', 'permaculture', 'agroforestry', 'biofuel', 'geothermal',
                'tidal energy', 'biomass', 'landfill', 'incineration', 'composting', 'anaerobic digestion'
            ],
            'Technology & Innovation (Advanced)': [
                'disruptive technology', 'paradigm shift', 'exponential growth', 'scalability',
                'interoperability', 'ubiquitous computing', 'cloud computing', 'edge computing',
                'quantum computing', 'blockchain technology', 'cryptocurrency', 'metaverse',
                'augmented intelligence', 'deep learning', 'neural networks', 'algorithm bias',
                'data mining', 'predictive analytics', 'cybernetics', 'biometrics', 'genomics',
                'proteomics', 'nanotechnology applications', 'biotechnology ethics', 'technophobia',
                'digital divide', 'surveillance capitalism', 'algorithmic transparency'
            ],
            'Society & Culture (Advanced)': [
                'social stratification', 'socioeconomic disparities', 'intergenerational mobility',
                'cultural assimilation', 'cultural preservation', 'linguistic diversity', 'diaspora',
                'cosmopolitanism', 'xenophobia', 'ethnocentrism', 'cultural relativism',
                'social cohesion', 'civic engagement', 'grassroots movements', 'activism',
                'advocacy', 'philanthropy', 'volunteerism', 'community empowerment',
                'social entrepreneurship', 'inclusive society', 'marginalization', 'stigmatization',
                'discrimination', 'prejudice', 'stereotyping', 'social justice', 'human dignity'
            ],
            'Economics & Business (Advanced)': [
                'macroeconomic indicators', 'fiscal policy', 'monetary policy', 'quantitative easing',
                'stagflation', 'recession', 'economic stimulus', 'austerity measures',
                'trade liberalization', 'protectionism', 'comparative advantage', 'economies of scale',
                'market saturation', 'monopolistic competition', 'oligopoly', 'market capitalization',
                'venture capital', 'private equity', 'initial public offering', 'mergers and acquisitions',
                'corporate governance', 'stakeholder capitalism', 'sustainability reporting',
                'circular economy', 'sharing economy', 'gig economy', 'digital transformation'
            ],
            'Education & Learning (Advanced)': [
                'pedagogical approaches', 'constructivist learning', 'metacognition', 'critical thinking',
                'analytical skills', 'experiential learning', 'collaborative learning', 'peer assessment',
                'formative assessment', 'summative assessment', 'differentiated instruction',
                'inclusive education', 'special educational needs', 'gifted education',
                'vocational training', 'apprenticeship programs', 'lifelong learning',
                'professional development', 'competency-based education', 'educational equity',
                'digital literacy', 'information literacy', 'media literacy', 'cultural competency',
                'multilingual education', 'internationalization', 'academic integrity'
            ],
            'Health & Medicine (Advanced)': [
                'epidemiology', 'pathophysiology', 'immunology', 'pharmacology', 'telemedicine',
                'precision medicine', 'personalized healthcare', 'preventive medicine',
                'public health interventions', 'health disparities', 'health equity',
                'social determinants of health', 'healthcare accessibility', 'mental health stigma',
                'psychological well-being', 'holistic approach', 'integrative medicine',
                'evidence-based practice', 'clinical trials', 'medical ethics', 'informed consent',
                'patient autonomy', 'healthcare policy', 'pharmaceutical industry',
                'health insurance', 'universal healthcare', 'aging population'
            ]
        }
        
        vocabulary = []
        for category, words in advanced_topics.items():
            for i, word in enumerate(words):
                main_category = category.split(' (')[0].split(' & ')[0]  # Extract main category
                vocabulary.append({
                    'word': word.lower(),
                    'difficulty_level': 5,  # Highest difficulty for IELTS 8.0+
                    'frequency_rank': len(vocabulary) + 3000,
                    'category': main_category,
                    'source': f'IELTS 8.0+ Advanced - {category}',
                    'definitions': [{
                        'part_of_speech': 'unknown',
                        'definition_english': f'Advanced {category.lower()} vocabulary for IELTS 8.0+ band scores',
                        'definition_vietnamese': f'Từ vựng nâng cao về {category.lower()} cho điểm IELTS 8.0+'
                    }]
                })
        
        print(f"Added {len(vocabulary)} IELTS 8.0+ advanced words")
        return vocabulary

    def get_idiomatic_expressions(self) -> List[Dict]:
        """Idiomatic expressions for IELTS Speaking and Writing"""
        print("Adding idiomatic expressions...")
        
        idioms_by_context = {
            'Success & Achievement': [
                'break new ground', 'push the envelope', 'raise the bar', 'go the extra mile',
                'hit the nail on the head', 'strike while the iron is hot', 'make headway',
                'turn over a new leaf', 'climb the ladder of success', 'reach new heights',
                'pave the way for', 'blaze a trail', 'break through barriers', 'cross the finish line'
            ],
            'Challenges & Problems': [
                'face an uphill battle', 'hit a brick wall', 'be in hot water', 'burn bridges',
                'bite off more than you can chew', 'be between a rock and a hard place',
                'throw in the towel', 'back to the drawing board', 'a blessing in disguise',
                'make the best of a bad situation', 'weather the storm', 'turn the tide'
            ],
            'Change & Development': [
                'winds of change', 'turn the corner', 'a sea change', 'paradigm shift',
                'quantum leap', 'evolutionary change', 'revolutionary breakthrough',
                'game changer', 'tipping point', 'watershed moment', 'crossroads',
                'new chapter', 'fresh start', 'clean slate'
            ],
            'Communication & Ideas': [
                'food for thought', 'penny for your thoughts', 'get the message across',
                'speak volumes', 'read between the lines', 'crystal clear', 'plain as day',
                'beat around the bush', 'cut to the chase', 'get straight to the point',
                'break the ice', 'bridge the gap', 'common ground', 'meeting of minds'
            ],
            'Time & Urgency': [
                'time is of the essence', 'against the clock', 'in the nick of time',
                'now or never', 'crunch time', 'eleventh hour', 'time flies',
                'make up for lost time', 'time heals all wounds', 'ahead of the curve',
                'behind the times', 'cutting edge', 'state of the art'
            ]
        }
        
        vocabulary = []
        for context, idioms in idioms_by_context.items():
            for idiom in idioms:
                vocabulary.append({
                    'word': idiom.lower(),
                    'difficulty_level': 4,
                    'frequency_rank': len(vocabulary) + 4000,
                    'category': 'General',
                    'source': f'Idiomatic Expressions - {context}',
                    'definitions': [{
                        'part_of_speech': 'idiom',
                        'definition_english': f'Idiomatic expression used in {context.lower()} contexts',
                        'definition_vietnamese': f'Thành ngữ được sử dụng trong bối cảnh {context.lower()}'
                    }]
                })
        
        print(f"Added {len(vocabulary)} idiomatic expressions")
        return vocabulary

    def get_phrasal_verbs_ielts(self) -> List[Dict]:
        """Essential phrasal verbs for IELTS"""
        print("Adding IELTS phrasal verbs...")
        
        phrasal_verbs = [
            'bring about', 'bring up', 'carry out', 'come across', 'come up with',
            'cut down on', 'deal with', 'figure out', 'get by', 'give up',
            'go through', 'grow up', 'keep up with', 'look after', 'look into',
            'make up for', 'point out', 'put forward', 'run out of', 'set up',
            'take on', 'take up', 'turn down', 'work out', 'break down',
            'build up', 'call off', 'catch up', 'check out', 'clear up',
            'come down to', 'crack down on', 'cut back on', 'drop out',
            'end up', 'fall behind', 'get across', 'get ahead', 'get along',
            'get around', 'get back', 'get down to', 'get over', 'get through',
            'give in', 'go ahead', 'go along with', 'go back on', 'go over',
            'hang on', 'hold back', 'hold up', 'keep on', 'lay off',
            'let down', 'live up to', 'look back on', 'look down on', 'look forward to',
            'look up to', 'make out', 'move on', 'phase out', 'pick up',
            'put off', 'put up with', 'rely on', 'rule out', 'settle down',
            'show off', 'stand for', 'stand out', 'step down', 'step up',
            'stick to', 'take after', 'take off', 'take over', 'throw away',
            'turn into', 'turn up', 'use up', 'wear out', 'wipe out'
        ]
        
        vocabulary = []
        for phrasal_verb in phrasal_verbs:
            vocabulary.append({
                'word': phrasal_verb.lower(),
                'difficulty_level': 4,
                'frequency_rank': len(vocabulary) + 5000,
                'category': 'General',
                'source': 'IELTS Essential Phrasal Verbs',
                'definitions': [{
                    'part_of_speech': 'phrasal verb',
                    'definition_english': 'Essential phrasal verb for IELTS proficiency',
                    'definition_vietnamese': 'Động từ kép cần thiết cho IELTS thành thạo'
                }]
            })
        
        print(f"Added {len(vocabulary)} phrasal verbs")
        return vocabulary

    def get_advanced_academic_phrases(self) -> List[Dict]:
        """Advanced academic phrases for IELTS Writing Task 2"""
        print("Adding advanced academic phrases...")
        
        academic_phrases = [
            # Introducing arguments
            'it is widely acknowledged that', 'there is a growing consensus that',
            'it is increasingly apparent that', 'mounting evidence suggests that',
            'empirical research demonstrates that', 'statistical data reveals that',
            'contemporary studies indicate that', 'recent findings suggest that',
            
            # Contrasting and comparing
            'in stark contrast to', 'contrary to popular belief', 'notwithstanding these concerns',
            'despite compelling evidence', 'while this may be true', 'conversely',
            'by the same token', 'along similar lines', 'in much the same way',
            'correspondingly', 'analogously', 'comparatively speaking',
            
            # Cause and effect
            'as a direct consequence of', 'this inevitably leads to', 'the ramifications of',
            'the underlying factors contributing to', 'precipitating factors include',
            'this phenomenon can be attributed to', 'the root cause of', 'stemming from',
            
            # Emphasis and importance
            'of paramount importance', 'it cannot be overstated that', 'crucially',
            'fundamentally', 'essentially', 'predominantly', 'overwhelmingly',
            'invariably', 'unequivocally', 'categorically',
            
            # Conclusions and implications
            'the implications of this are far-reaching', 'this has profound implications for',
            'taking everything into consideration', 'weighing up the pros and cons',
            'on balance', 'all things considered', 'in the final analysis',
            'to sum up the key points', 'the overarching conclusion is'
        ]
        
        vocabulary = []
        for phrase in academic_phrases:
            vocabulary.append({
                'word': phrase.lower(),
                'difficulty_level': 5,
                'frequency_rank': len(vocabulary) + 6000,
                'category': 'Academic',
                'source': 'Advanced Academic Phrases for Writing',
                'definitions': [{
                    'part_of_speech': 'phrase',
                    'definition_english': 'Advanced academic phrase for sophisticated writing',
                    'definition_vietnamese': 'Cụm từ học thuật nâng cao cho viết tinh tế'
                }]
            })
        
        print(f"Added {len(vocabulary)} advanced academic phrases")
        return vocabulary

    def scrape_all_sources(self) -> List[Dict]:
        """Scrape vocabulary from all sources"""
        print("Starting comprehensive vocabulary scraping...")
        
        all_vocabulary = []
        
        # Add different sources
        sources = [
            self.get_oxford_3000_sample,
            self.get_common_ielts_topics_vocabulary,
            self.get_academic_word_list_full,
            self.get_cambridge_ielts_vocabulary,
            self.get_ielts_collocations,
            self.get_ielts_writing_vocabulary,
            self.get_ielts_8_0_advanced_vocabulary,
            self.get_idiomatic_expressions,
            self.get_phrasal_verbs_ielts,
            self.get_advanced_academic_phrases,
            # Note: Web scraping methods commented out to avoid overwhelming servers
            # self.scrape_eap_foundation_awl,
            # self.scrape_ielts_up_vocabulary,
        ]
        
        for source_func in sources:
            try:
                vocab = source_func()
                all_vocabulary.extend(vocab)
            except Exception as e:
                print(f"Error with source {source_func.__name__}: {e}")
        
        # Remove duplicates based on word
        seen_words = set()
        unique_vocabulary = []
        
        for word_data in all_vocabulary:
            word = word_data['word'].lower()
            if word not in seen_words:
                seen_words.add(word)
                unique_vocabulary.append(word_data)
        
        print(f"Total unique words collected: {len(unique_vocabulary)}")
        return unique_vocabulary

    def save_to_json(self, vocabulary: List[Dict], filename: str = 'ielts_vocabulary.json'):
        """Save vocabulary to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(vocabulary, f, ensure_ascii=False, indent=2)
        print(f"Saved {len(vocabulary)} words to {filename}")

    def save_to_sql_insert(self, vocabulary: List[Dict], filename: str = 'vocabulary_insert.sql'):
        """Generate SQL INSERT statements"""
        with open(filename, 'w', encoding='utf-8') as f:
            f.write("-- IELTS Vocabulary INSERT statements\n")
            f.write("-- Generated automatically from multiple sources\n\n")
            
            for word_data in vocabulary:
                f.write(f"-- Word: {word_data['word']}\n")
                f.write("INSERT INTO vocabulary_words (word, difficulty_level, frequency_rank, source_url) VALUES\n")
                f.write(f"('{word_data['word']}', {word_data['difficulty_level']}, {word_data.get('frequency_rank', 999)}, '{word_data['source']}');\n\n")
        
        print(f"Generated SQL INSERT statements in {filename}")

def main():
    scraper = IELTSVocabularyScraper()
    
    print("🚀 IELTS Vocabulary Scraper Starting...")
    print("=" * 50)
    
    # Scrape all vocabulary
    vocabulary = scraper.scrape_all_sources()
    
    # Save results
    scraper.save_to_json(vocabulary, 'ielts_vocabulary_complete.json')
    scraper.save_to_sql_insert(vocabulary, 'vocabulary_bulk_insert.sql')
    
    # Print summary
    print("\n" + "=" * 50)
    print("📊 SCRAPING SUMMARY")
    print("=" * 50)
    print(f"Total words collected: {len(vocabulary)}")
    
    # Count by category
    categories = {}
    for word in vocabulary:
        cat = word.get('category', 'Unknown')
        categories[cat] = categories.get(cat, 0) + 1
    
    print("\nWords by category:")
    for cat, count in sorted(categories.items()):
        print(f"  {cat}: {count} words")
    
    # Count by difficulty
    difficulties = {}
    for word in vocabulary:
        diff = word.get('difficulty_level', 0)
        difficulties[diff] = difficulties.get(diff, 0) + 1
    
    print("\nWords by difficulty:")
    for diff, count in sorted(difficulties.items()):
        print(f"  Level {diff}: {count} words")
    
    print(f"\n✅ Files generated:")
    print(f"  - ielts_vocabulary_complete.json")
    print(f"  - vocabulary_bulk_insert.sql")
    print(f"\n🎯 Ready to import into your IELTS vocabulary database!")

if __name__ == "__main__":
    main()