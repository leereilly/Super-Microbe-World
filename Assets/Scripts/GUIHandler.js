﻿#pragma strict

public class GUIHandler extends MonoBehaviour{

	private var numImagesPhone: int;
	//imagesLx will contain the images to be displayed on the phone for the level x. They will be displayed in order. The size of each array must be adjusted in the editor.
	public var imagesL1: Texture2D[] = new Texture2D[numImagesPhone];
	public var imagesL2: Texture2D[] = new Texture2D[numImagesPhone];
	public var imagesL3: Texture2D[] = new Texture2D[numImagesPhone];
	public var imagesL4: Texture2D[] = new Texture2D[numImagesPhone];
	public var imagesL5: Texture2D[] = new Texture2D[numImagesPhone];
	
	private var infoImageWidth: int;
	private var infoImageHeigth: int;
	public var infoImagePos: Vector2;
	private var showInfoImage: boolean; //Will be used to enable/disable showing the info images in the OnGUI() function
	
	private var currentLevel: int;
	private var currentArrayIm: Texture2D[];
	private var currentImageNum: int;
	private var currentImage: Texture2D;
	
	private var lives: int;					//Amount of lives remaining		//NOTE: switch to private!    ********************************************
	public var livesImg: Texture2D;
	public var livesPosHeight: int;
	public var livesPos1x: int;
	public var livesPos2x: int;
	public var livesPos3x: int;
	private var liveswidth: int;
	private var livesheight: int;
	
	private var antibiotic: int;				//Amount of antibiotics remaining		//NOTE: switch to private!    ********************************************
	public var antibioticImg: Texture2D;
	public var antibioticPos: Vector2;
	private var antibioticwidth: int;
	private var antibioticheight: int;
	
	private var whiteBloodCells: int;		//Amount of wbc remaining
	private var soapDrops: int;				//Number of remainig soap drops
	
	public var InGamePhone: GameObject;		//The phone
	private var phoneAnim : Animator;	//The Animator component attached to the InGamePhone GameObject
	
	private var widthScreen: int;
	private var heightScreen: int;
	
	private var gameLogic: GameLogic;		//Keeps a reference of the gameLogic object
	private var currentLevelLogicScript: LevelLogic;	//Keeps a reference to the LevelLogicxxxxxx.js script that called the showInfoLevel() function to notify the script when finished displaying the information
	
	/**Other vars**/
	private var firstRun = true;		//To perform some operations in the update function just the first loop 
	
	function Awake() {
	
		gameLogic = GameObject.Find("GameLogic").GetComponent("GameLogic");
		
		widthScreen = Screen.width;
		heightScreen = Screen.height;
		
		infoImageWidth = imagesL1[0].width;
		infoImageHeigth = imagesL1[0].height; 
		
		liveswidth = livesImg.width;
		livesheight = livesImg.height;
		
		antibioticwidth = antibioticImg.width;
		antibioticheight = antibioticImg.height;
		
		InGamePhone = Instantiate(InGamePhone);
		var ingamephonetransform = transform.Find("InGamePhone");
		if (!ingamephonetransform) Debug.Log("InGamePhone not found!!!!");
		InGamePhone = ingamephonetransform.gameObject;
		if(!InGamePhone) Debug.LogError("InGamePhone not found. Drag and drop the InGamePrefab to the public variable of the GUIHandler script attached to the GUI object in the editor.");
		else phoneAnim = InGamePhone.GetComponent(Animator);
	
	}
	
	function Start () {
		
		
//		test();
	}
	
//	private function test(){
//		Debug.Log("Waiting 0.5 seconds...");
//		yield new WaitForSeconds(0.5);
//		Debug.Log("Showing questions...");
//		showInfoLevel(1, null);
//	}
	
	function Update () {
		if (firstRun){
			firstRun = false;
			
			
//			infoImageWidth = imagesL1[0].width;
//			infoImageHeigth = imagesL1[0].height; 
//			
//			liveswidth = livesImg.width;
//			livesheight = livesImg.height;
//			
//			antibioticwidth = antibioticImg.width;
//			antibioticheight = antibioticImg.height;
//			
//			InGamePhone = transform.Find("InGamePhone").gameObject;
//		if(!InGamePhone) Debug.LogError("InGamePhone not found. Drag and drop the InGamePrefab to the public variable of the GUIHandler script attached to the GUI object in the editor.");
//		else phoneAnim = InGamePhone.GetComponent(Animator);
		}
	}
	
	//MonoBehaviour's class to manage the GUI
	public function OnGUI(){
		if (lives>0) GUI.Label (Rect (livesPos1x,livesPosHeight,liveswidth,livesheight), livesImg);		//First heart
		if (lives>1) GUI.Label (Rect (livesPos2x,livesPosHeight,liveswidth,livesheight), livesImg);		//Second heart
		if (lives>2) GUI.Label (Rect (livesPos3x,livesPosHeight,liveswidth,livesheight), livesImg);		//First heart
		if (antibiotic > 0) GUI.Label (Rect (antibioticPos.x,antibioticPos.y,antibioticwidth,antibioticheight), antibioticImg);
		if (showInfoImage)
			if (GUI.Button (Rect (infoImagePos.x, infoImagePos.y, infoImageWidth, infoImageHeigth), currentImage, "label")) {	//This will paint a button without border
				print ("Next image");
				showNextInfoImage();
			}
	}
	
	public function UpdateGUI(life : int, soapDrops : int, whiteBloodCells : int, Antibiotics : int){
		lives = life;
		this.soapDrops = soapDrops;
		this.whiteBloodCells = whiteBloodCells;
		antibiotic = Antibiotics;
	}
	
	/*
		This function will display the mobile phone with the information for the level selected.
	*/
	public function showInfoLevel(level: int, levelLogic: LevelLogic){
		
		currentLevel = level;
		currentLevelLogicScript = levelLogic;
		switch (level){
			case 1:
				currentArrayIm = imagesL1;
				break;
			case 2:
				currentArrayIm = imagesL2;
				break;
			case 3:
				currentArrayIm = imagesL3;
				break;
			case 4:
				currentArrayIm = imagesL4;
				break;
			case 5:
				currentArrayIm = imagesL5;
				break;
			default:
				currentArrayIm = imagesL1;
				Debug.LogError("There isn't round number " + level + ". The rounds go from 1 to 5.");
		}
		currentImageNum = 0;
		phoneAnim.SetTrigger("PhoneBig");	//To make it small again the trigger is "PhoneSmall"
		yield new WaitForSeconds(0.8);		//0.8 is the time the animation takes to be played
		showNextInfoImage();
	}
	
	private function showNextInfoImage(){
		if(currentImageNum < currentArrayIm.length){		//There is still at least one more image to show
			currentImage = currentArrayIm[currentImageNum];
			showInfoImage = true;
			currentImageNum++;
		}else{													//Finished showing the information images
			showInfoImage = false;
			currentImage = null;
			phoneAnim.SetTrigger("PhoneSmall");
			//Inform the LevelLogic script that info has finished to be displayed and we can continue with the game
			currentLevelLogicScript.ShowInfoLevelFinished();
		}
	}
	
}///End of class